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
        <body>
            <p>Tisztelt {message.name}!</p>
            <p>Köszönettel vettük megkeresését.</p>
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