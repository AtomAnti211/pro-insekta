import json
from datetime import date
from django.test import TestCase
from freezegun import freeze_time
from django.core.serializers.json import DjangoJSONEncoder
import os

from insecta.models import Contract, Job, Customer, Location, Service, Owner
from insecta.services import get_contracts_due_0_12


SNAPSHOT_PATH = os.path.join(
    os.path.dirname(__file__),
    "snapshots",
    "contracts_multi.json"
)


@freeze_time("2026-04-07")
class ContractSnapshotMultiTest(TestCase):

    def setUp(self):
        # OWNER
        self.owner = Owner.objects.create(
            ownerName="Test Owner",
            ownerVat="123",
            ownerPostCode="4000",
            ownerAddress="Debrecen",
            ownerWorker="Worker",
            ownerPermission="Perm"
        )

        # CUSTOMER
        self.customer = Customer.objects.create(
            customerName="Snapshot Customer",
            customerVat="111",
            customerPostCode="4030",
            customerCity="Debrecen",
            customerAddress="Valami utca 1"
        )

        # LOCATION
        self.location = Location.objects.create(
            locationPostCode="4030",
            locationCity="Debrecen",
            locationAddress="Valami utca 1",
            locationLat=0,
            locationLng=0
        )

        # SERVICE
        self.service = Service.objects.create(
            serviceName="kártevőmentesítés"
        )

    def create_contract(self, **kwargs):
        defaults = dict(
            contractCustomerName=self.customer,
            contractLocationName=self.location,
            contractServiceName=self.service,
            contractStart=date(2024, 1, 1),
            contractFrequencyMonth=1,
            contractValid=True
        )
        defaults.update(kwargs)
        return Contract.objects.create(**defaults)

    def test_snapshot_multi(self):
        """Snapshot teszt több szerződéssel."""

        # C1 → nincs last_job
        c1 = self.create_contract()

        # C2 → last_job 1 hónapja
        c2 = self.create_contract()
        Job.objects.create(jobcontractId=c2, jobStart=date(2026, 3, 7))

        # C3 → last_job 2 hónapja
        c3 = self.create_contract()
        Job.objects.create(jobcontractId=c3, jobStart=date(2026, 2, 7))

        # C4 → jövőben induló szerződés
        c4 = self.create_contract(contractStart=date(2026, 5, 1))

        # C5 → overdue
        c5 = self.create_contract()
        Job.objects.create(jobcontractId=c5, jobStart=date(2025, 1, 1))

        # FUTTATJUK A FÜGGVÉNYT
        result = sorted(get_contracts_due_0_12(), key=lambda x: (x["contractId"], x["monthsUntilDue"]))

        # --- SNAPSHOT BETÖLTÉSE ---
        if not os.path.exists(SNAPSHOT_PATH):
            # első futás → snapshot létrehozása
            with open(SNAPSHOT_PATH, "w", encoding="utf-8") as f:
                json.dump(result, f, cls=DjangoJSONEncoder, indent=2, ensure_ascii=False)
            self.fail("Snapshot created. Run the test again.")

        with open(SNAPSHOT_PATH, "r", encoding="utf-8") as f:
            expected = json.load(f)

        # --- ÖSSZEHASONLÍTÁS ---
        self.assertJSONEqual(
            json.dumps(result, cls=DjangoJSONEncoder),
            json.dumps(expected, cls=DjangoJSONEncoder)
        )
