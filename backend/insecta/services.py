from django.db.models import Max
from datetime import date
from dateutil.relativedelta import relativedelta
from .models import Contract

def months_between(d1, d2):
    r = relativedelta(d2, d1)
    return r.years * 12 + r.months

def get_due_contracts(X):
    future_date = date.today() + relativedelta(months=X)

    qs = (
        Contract.objects
        .filter(contractValid=True)
        .annotate(last_job=Max("job__JobDoneDate"))
    )

    result = []

    for c in qs:
        if not c.last_job:
            if X == 0:
                result.append(c)
                continue
            continue
        # ha nem volt és 0 a hónap, akkor menjünk atonnal

        diff = months_between(c.last_job, future_date)

        if diff % c.contractFrequencyMonth == 0:
            result.append(c)

    return result
