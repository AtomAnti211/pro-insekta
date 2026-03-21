import datetime
import json
import os
import base64
import tempfile

from django.http import FileResponse, HttpResponse
from django.template.loader import render_to_string
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
HONAPOK = [
    "", "január", "február", "március", "április", "május", "június",
    "július", "augusztus", "szeptember", "október", "november", "december"
]

from pyhtml2pdf import converter

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
    formatted_date = f"{today.year}. {HONAPOK[today.month]}"


    # LOGO BASE64
    logo_path = os.path.join(settings.BASE_DIR, "insecta/static/images/logo.jpg")
    with open(logo_path, "rb") as f:
        logo_data = base64.b64encode(f.read()).decode("utf-8")
    logo_url = f"data:image/jpeg;base64,{logo_data}"

    # FONT PATH (Chrome támogatja a @font-face-t)
    font_path = os.path.join(
        settings.BASE_DIR,
        "insecta/static/fonts_runtime/Montserrat-Regular.ttf"
    )

    # HTML render
    html = render_to_string("workorder_template.html", {
        "contracts": contracts,
        "owner": owner,
        "date_str": formatted_date,
        "logo_url": logo_url,
        "font_path": font_path,
    })

    # 1) Ideiglenes HTML fájl
    with tempfile.NamedTemporaryFile(suffix=".html", delete=False) as html_file:
        html_file.write(html.encode("utf-8"))
        html_path = html_file.name

    # 2) PDF útvonal
    pdf_path = html_path.replace(".html", ".pdf")

    # 3) PDF generálás Chrome headless segítségével
    converter.convert(f"file:///{html_path}", pdf_path)

    # 4) PDF visszaküldése
    return FileResponse(open(pdf_path, "rb"), content_type="application/pdf")