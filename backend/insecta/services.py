from datetime import date
from dateutil.relativedelta import relativedelta
from .models import Contract, Job,Owner
 
def get_contracts_due_0_12():
    today = date.today()
    results = []

    owner = Owner.objects.first()  # <-- fontos!

    contracts = Contract.objects.filter(contractValid=True).select_related(
        "contractCustomerName",
        "contractLocationName",
        "contractServiceName",
    )

    for c in contracts:
        last_job = Job.objects.filter(jobcontractId=c).order_by("-jobStart").first()
        last_job_date = last_job.jobStart if last_job else c.contractStart

        next_due_date = last_job_date
        
        print(c,next_due_date)
        while next_due_date < today:
            next_due_date += relativedelta(months=c.contractFrequencyMonth)

        diff = relativedelta(next_due_date, today)
        months_until_due = diff.years * 12 + diff.months

        if 0 <= months_until_due <= 12:
            results.append({
                "contractId": c.id,
                "contractStart": c.contractStart,
                "contractFrequencyMonth": c.contractFrequencyMonth,
                "lastJob": last_job_date,
                "nextDueDate": next_due_date,
                "monthsUntilDue": months_until_due,
                "dueNow": 1 if months_until_due == 0 else 0,

                # OWNER (globális)
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

                # SERVICE
                "serviceId": c.contractServiceName.id,
                "serviceName": c.contractServiceName.serviceName,
            })

    return results

