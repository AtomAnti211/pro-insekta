import datetime
import json
import locale
import os
from io import BytesIO

from django.http import HttpResponse
from django.template.loader import render_to_string
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

from xhtml2pdf import pisa

from ..models import Owner, Contract


@csrf_exempt
def workorder_pdf(request):
    if request.method != "POST":
        return HttpResponse(status=405)

    body = json.loads(request.body)
    ids = body.get("ids", [])

    contracts = Contract.objects.filter(id__in=ids)
    owner = Owner.objects.first()

    today = datetime.date.today()

    locale.setlocale(locale.LC_TIME, "hu_HU.UTF-8")
    formatted_date = today.strftime("%Y. %B")

    logo_path = os.path.join(settings.BASE_DIR, "static/images/logo.png")
    logo_url = f"file:///{logo_path.replace('\\', '/')}"

    html = render_to_string("workorder_template.html", {
        "contracts": contracts,
        "owner": owner,
        "date_str": formatted_date,
        "logo_url": logo_url,
    })

    result = BytesIO()
    pisa.CreatePDF(html, dest=result)

    response = HttpResponse(result.getvalue(), content_type="application/pdf")
    response["Content-Disposition"] = "attachment; filename=munkalap.pdf"
    return response



