from datetime import date
from dateutil.relativedelta import relativedelta
from .models import Contract, Job, Owner

def get_contracts_due_0_12():
    today = date.today()
    results = []

    owner = Owner.objects.first()

    contracts = Contract.objects.filter(contractValid=True).select_related(
        "contractCustomerName",
        "contractLocationName",
        "contractServiceName",
    )

    for c in contracts:
        last_job = Job.objects.filter(jobcontractId=c).order_by("-jobStart").first()
        last_job_date = last_job.jobStart if last_job else max(c.contractStart, today)

        next_due_date = (
            last_job.jobStart + relativedelta(months=c.contractFrequencyMonth)
            if last_job
            else max(c.contractStart, today)
        )

        if next_due_date < today:
            next_due_date = today

        # első hónap kiszámítása
        months_until_due = (next_due_date.year - today.year) * 12 + (next_due_date.month - today.month)

        # fontos: contractonként új set
        seen_months = set()

        # ciklus 12 hónapig
        while next_due_date <= today + relativedelta(months=12):

            if months_until_due not in seen_months:
                seen_months.add(months_until_due)

                results.append({
                    "contractId": c.id,
                    "contractStart": c.contractStart,
                    "contractFrequencyMonth": c.contractFrequencyMonth,
                    "lastJob": last_job_date,
                    "nextDueDate": next_due_date,
                    "monthsUntilDue": months_until_due,
                    "dueNow": 1 if months_until_due == 0 else 0,

                    # OWNER
                    "ownerName": owner.ownerName,
                    "ownerVat": owner.ownerVat,
                    "ownerPostCode": owner.ownerPostCode,
                    "ownerAddress": owner.ownerAddress,
                    "ownerWorker": owner.ownerWorker,
                    "ownerPermission": owner.ownerPermission,

                    # CUSTOMER
                    "customerId": c.contractCustomerName.id,
                    "customerName": c.contractCustomerName.customerName,
                    "customerVat": c.contractCustomerName.customerVat,
                    "customerPostCode": c.contractCustomerName.customerPostCode,
                    "customerCity": c.contractCustomerName.customerCity,
                    "customerAddress": c.contractCustomerName.customerAddress,

                    # LOCATION
                    "locationId": c.contractLocationName.id,
                    "locationPostCode": c.contractLocationName.locationPostCode,
                    "locationCity": c.contractLocationName.locationCity,
                    "locationAddress": c.contractLocationName.locationAddress,
                    "locationLat": c.contractLocationName.locationLat,
                    "locationLng": c.contractLocationName.locationLng,

                    # SERVICE
                    "serviceId": c.contractServiceName.id,
                    "serviceName": c.contractServiceName.serviceName,
                })

            # következő esedékesség
            next_due_date += relativedelta(months=c.contractFrequencyMonth)
            months_until_due = (next_due_date.year - today.year) * 12 + (next_due_date.month - today.month)

    return results
