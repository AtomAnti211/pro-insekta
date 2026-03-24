from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.core.mail import EmailMultiAlternatives
from email.mime.image import MIMEImage

from ..serializers import ContactMessageSerializer


@api_view(["POST"])
def contactMessageCreate(request):
    serializer = ContactMessageSerializer(data=request.data)

    if serializer.is_valid():
        message = serializer.save()

        subject = f"Visszaigazolás kártevőmentesítéssel kapcsolatos megkereséséről: {message.name}"
        from_email = "noreply@yourdomain.com"
        to = [message.email, "bedit968@gmail.com"]

        text_content = "Köszönjük a megkeresést."

        html_content = f"""
        
        <html>
        <head>
            <style>
                body {{
                    font-family: Georgia, 'Times New Roman', serif;
                    color: #333;
                }}
                .header {{
                    text-align: center;
                    margin-bottom: 20px;
                }}
                .logo {{
                    width: 180px;
                }}
                .highlight {{
                    color: #c62828;
                }}
            </style>
        </head>
        <body>

            <p>Tisztelt <span class="highlight">{message.name}</span>!</p>

            <p>
                Köszönettel vettük megkeresését kártevőmentesítéssel kapcsolatban.
                Kollégáink hamarosan felveszik Önnel a kapcsolatot a megadott elérhetőségeken.
            </p>

            <p><strong>Név:</strong> {message.name}<br>
            <strong>Email:</strong> {message.email}<br>
            <strong>Telefon:</strong> {message.phone}</p>
            <strong>Cím:</strong> {message.address}</p>
            <p><strong>Érdeklődési kör:</strong> {message.activity.activityName if message.activity else 'N/A'}</p>
            <p><strong>Üzenet:</strong><br>{message.message}</p>

            <br>
            <p>Üdvözlettel,<br>
            <strong>Insecta Kft.</strong><br>
            Mekk Elek<br>
            ügyvezető</p>
            <div class="footer">
                <img src="cid:company_logo" class="logo">
            </div>
        </body>
        </html>
        """

        msg = EmailMultiAlternatives(subject, text_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")

        with open("insecta/static/logo.png", "rb") as f:
            msg_image = MIMEImage(f.read())
            msg_image.add_header("Content-ID", "<company_logo>")
            msg.attach(msg_image)

        msg.send()

        return Response({"status": "ok"}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)