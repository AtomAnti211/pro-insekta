import datetime
import json
import os
import tempfile

from django.http import FileResponse, HttpResponse
from django.template.loader import render_to_string
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

from playwright.sync_api import sync_playwright

from ..models import Owner, Contract

HONAPOK = [
    "", "január", "február", "március", "április", "május", "június",
    "július", "augusztus", "szeptember", "október", "november", "december"
]

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

    # LOGO FILE PATH (Playwright támogatja a file:// hivatkozást)
    logo_path = os.path.join(settings.BASE_DIR, "insecta/static/images/logo.jpg")
    logo_url = f"file:///{logo_path}"

    # FONT FILE PATH
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

    # Ideiglenes HTML fájl
    with tempfile.NamedTemporaryFile(suffix=".html", delete=False) as html_file:
        html_file.write(html.encode("utf-8"))
        html_path = html_file.name

    # PDF útvonal
    pdf_path = html_path.replace(".html", ".pdf")

    # Playwright PDF generálás
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        page.goto(f"file:///{html_path}")
        page.pdf(path=pdf_path,
                 width="210mm",
                height="148mm",
                print_background=True
        )

        browser.close()

    return FileResponse(open(pdf_path, "rb"), content_type="application/pdf")

