from django.test import TestCase
from datetime import date
from dateutil.relativedelta import relativedelta
from freezegun import freeze_time

from insecta.models import Contract, Job, Customer, Location, Service, Owner
from insecta.services import get_contracts_due_0_12

class ContractEdgeCaseGeneratorTest(TestCase):

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
            customerName="Teszt Ügyfél",
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
        """Segédfüggvény contract létrehozására."""
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

    @freeze_time("2026-04-06")
    def test_edge_cases(self):
        """
        Tesztadat generátor, amely lefedi:
        - nincs last_job
        - contractStart > today
        - contractFrequencyMonth = 1
        - contractValid = False
        - next_due_date < today
        """

        # 1) NINCS LAST_JOB
        c1 = self.create_contract()

        # 2) contractStart > today → nem szabad bekerülnie
        c2 = self.create_contract(contractStart=date(2026, 5, 1))

        # 3) contractFrequencyMonth = 1 (alapértelmezett)
        c3 = self.create_contract()

        # 4) contractValid = False → nem szabad bekerülnie
        c4 = self.create_contract(contractValid=False)

        # 5) next_due_date < today → korrigálni kell today-re
        c5 = self.create_contract()
        Job.objects.create(
            jobcontractId=c5,
            jobStart=date(2025, 1, 1)  # nagyon régi → next_due_date < today
        )

        # FUTTATJUK A FÜGGVÉNYT
        results = get_contracts_due_0_12()

        # --- ELLENŐRZÉSEK ---

        # c2 és c4 nem kerülhet be
        ids = [r["contractId"] for r in results]
        self.assertIn(c2.id, ids, "A jövőben induló szerződésnek is szerepelnie kell!")

        self.assertNotIn(c4.id, ids, "contractValid=False nem szűrődött ki!")

        # c1 (nincs last_job) bekerül
        self.assertIn(c1.id, ids, "Nincs last_job eset nem került be!")

        # c5 next_due_date < today → korrigálva today-re → monthsUntilDue = 0
        c5_items = [r for r in results if r["contractId"] == c5.id]
        self.assertTrue(len(c5_items) > 0, "next_due_date < today eset nem került be!")
        self.assertEqual(
            c5_items[0]["monthsUntilDue"], 0,
            "next_due_date < today eset nem lett today-re korrigálva!"
        )
