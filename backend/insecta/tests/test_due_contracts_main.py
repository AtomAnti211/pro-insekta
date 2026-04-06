from datetime import date
from django.test import TestCase
from freezegun import freeze_time

from insecta.models import Contract, Job, Customer, Location, Service, Owner
from insecta.services import get_contracts_due_0_12


class ContractDueTest(TestCase):

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
            customerName="DEKO",
            customerVat="123",
            customerPostCode="4030",
            customerCity="Debrecen",
            customerAddress="Dárda utca 1"
        )

        # LOCATION
        self.location = Location.objects.create(
            locationPostCode="4030",
            locationCity="Debrecen",
            locationAddress="Dárda utca 1",
            locationLat=0,
            locationLng=0
        )

        # SERVICE
        self.service = Service.objects.create(
            serviceName="kártevőmentesítés"
        )

        # CONTRACT
        self.contract = Contract.objects.create(
            contractCustomerName=self.customer,
            contractLocationName=self.location,
            contractServiceName=self.service,
            contractStart=date(2024, 1, 1),
            contractFrequencyMonth=1,
            contractValid=True
        )

        # LAST JOB → úgy állítjuk be, hogy 0 hónap legyen
        self.last_job = Job.objects.create(
            jobcontractId=self.contract,
            jobStart=date(2026, 3, 7)
        )

    @freeze_time("2026-04-07")
    def test_no_duplicate_months(self):
        results = get_contracts_due_0_12()

        deko_items = [r for r in results if r["customerName"] == "DEKO"]
        months = [r["monthsUntilDue"] for r in deko_items]

        # nincs duplikáció
        self.assertEqual(len(months), len(set(months)))

        # van 0 és 1 hónap
        self.assertIn(0, months)
        self.assertIn(1, months)

        # pontosan 1 db 0 és 1 hónap
        self.assertEqual(months.count(0), 1)
        self.assertEqual(months.count(1), 1)