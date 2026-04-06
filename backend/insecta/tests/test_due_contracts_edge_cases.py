from datetime import date
from django.test import TestCase
from freezegun import freeze_time

from insecta.models import Contract, Job, Customer, Location, Service, Owner
from insecta.services import get_contracts_due_0_12


@freeze_time("2026-04-07")
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

    def test_edge_cases(self):
        """
        Lefedett esetek:
        - nincs last_job
        - contractStart > today
        - contractFrequencyMonth = 1
        - contractValid = False
        - next_due_date < today
        """

        # 1) NINCS LAST_JOB
        c1 = self.create_contract()

        # 2) contractStart > today → BE KELL KERÜLNIE
        c2 = self.create_contract(contractStart=date(2026, 5, 1))

        # 3) contractFrequencyMonth = 1 → alapértelmezett
        c3 = self.create_contract()

        # 4) contractValid = False → NEM kerülhet be
        c4 = self.create_contract(contractValid=False)

        # 5) next_due_date < today → korrigálni kell today-re
        c5 = self.create_contract()
        Job.objects.create(
            jobcontractId=c5,
            jobStart=date(2025, 1, 1)
        )

        results = get_contracts_due_0_12()
        ids = [r["contractId"] for r in results]

        # c1 → bekerül
        self.assertIn(c1.id, ids)

        # c2 → bekerül (jövőbeli szerződés is esedékes lehet)
        self.assertIn(c2.id, ids)

        # c4 → nem kerül be
        self.assertNotIn(c4.id, ids)

        # c5 → monthsUntilDue = 0
        c5_items = [r for r in results if r["contractId"] == c5.id]
        self.assertTrue(len(c5_items) > 0)
        self.assertEqual(c5_items[0]["monthsUntilDue"], 0)