from datetime import date
from dateutil.relativedelta import relativedelta
from django.test import TestCase
from insecta.models import Contract, Job, Customer, Location, Service, Owner
from insecta.services import get_contracts_due_0_12
from freezegun import freeze_time

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

        # LAST JOB → 2026.03.07
        self.last_job = Job.objects.create(
            jobcontractId=self.contract,
            jobStart=date(2026, 3, 7)
        )
    @freeze_time("2026-04-07")
    
    def test_no_duplicate_months(self):
        results = get_contracts_due_0_12()

        # Szűrés csak a DEKO contractra
        deko_items = [r for r in results if r["customerName"] == "DEKO"]

        # Ellenőrizzük, hogy nincs duplikált monthsUntilDue
        months = [r["monthsUntilDue"] for r in deko_items]
        self.assertEqual(len(months), len(set(months)),
                         "Duplikált monthsUntilDue érték keletkezett!")

        # Ellenőrizzük, hogy van 0 hónapos és 1 hónapos rekord
        self.assertIn(0, months, "Hiányzik a 0 hónapos rekord!")
        self.assertIn(1, months, "Hiányzik az 1 hónapos rekord!")

        # Pontosan 1 db 0 hónapos rekord legyen
        self.assertEqual(months.count(0), 1,
                         "A 0 hónapos rekord duplikálódott!")

        # Pontosan 1 db 1 hónapos rekord legyen
        self.assertEqual(months.count(1), 1,
                         "Az 1 hónapos rekord duplikálódott!")
