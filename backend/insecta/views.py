from turtle import write

from rest_framework.decorators import api_view,APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMultiAlternatives
from email.mime.image import MIMEImage


from .models import (
    Note, Activity, Owner, Customer, Location, Service, Contract, Job, ContactMessage
)

from .serializers import (
    ActivitySerializer, NoteReadSerializer, NoteWriteSerializer,
    OwnerSerializer, CustomerSerializer, LocationReadSerializer,
    LocationWriteSerializer, ServiceSerializer,
    ContractReadSerializer, ContractWriteSerializer,
    JobReadSerializer, JobWriteSerializer, ContactMessageSerializer,
    ContractDueSerializer
)
from .services import get_due_contracts

# Contact Message Create + Email Sending
@api_view(["POST"])
def contactMessageCreate(request):
    serializer = ContactMessageSerializer(data=request.data)

    if serializer.is_valid():
        message = serializer.save()

        # -------------------------
        # HTML-ES EMAIL KÜLDÉS
        # -------------------------

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

        # LOGÓ BEÁGYAZÁSA INLINE
        with open("insecta/static/logo.png", "rb") as f:
            msg_image = MIMEImage(f.read())
            msg_image.add_header("Content-ID", "<company_logo>")
            msg.attach(msg_image)

        msg.send()

        # -------------------------

        return Response({"status": "ok"}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# DUE CONTRACTS VIEW
class DueContractsView(APIView):
    def get(self, request):
        try:
            X = int(request.query_params.get("months", 1))
        except ValueError:
            return Response({"error": "Invalid months parameter"}, status=400)

        contracts = get_due_contracts(X)
        serializer = ContractDueSerializer(contracts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# OWNER (READ + UPDATE)

@api_view(["GET", "PUT"])
def ownerData(request):
    owner = Owner.objects.first()

    if request.method == "GET":
        serializer = OwnerSerializer(owner)
        return Response(serializer.data)

    if request.method == "PUT":
        serializer = OwnerSerializer(owner, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ACTIVITY CRUD

@api_view(["GET", "POST"])
def activityListCreate(request):
    if request.method == "GET":
        activities = Activity.objects.all().order_by("activityName")
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = ActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def activityDetail(request, id):
    try:
        activity = Activity.objects.get(id=id)
    except Activity.DoesNotExist:
        return Response({"error": "Activity not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ActivitySerializer(activity)
        return Response(serializer.data)

    if request.method == "PUT":
        serializer = ActivitySerializer(activity, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        activity.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Note CRUD

@api_view(["GET", "POST"])
def noteListCreate(request):
    if request.method == "GET":
        notes = Note.objects.all().order_by("-noteCreated")
        serializer = NoteReadSerializer(notes, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        write = NoteWriteSerializer(data=request.data)
        if write.is_valid():
            note = write.save()
            read = NoteReadSerializer(note)
            return Response(read.data, status=status.HTTP_201_CREATED)
        return Response(write.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def noteDetail(request, id):
    try:
        note = Note.objects.get(id=id)
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = NoteReadSerializer(note)
        return Response(serializer.data)

    elif request.method == 'PUT':
        write = NoteWriteSerializer(note, data=request.data)
        if write.is_valid():
            note = write.save()
            read = NoteReadSerializer(note)
            return Response(read.data)
        return Response(write.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PATCH':
        write = NoteWriteSerializer(note, data=request.data, partial=True)
        if write.is_valid():
            note = write.save()
            read = NoteReadSerializer(note)
            return Response(read.data)
        return Response(write.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




# CUSTOMER CRUD

@api_view(["GET", "POST"])
def customerListCreate(request):
    if request.method == "GET":
        customers = Customer.objects.all().order_by("customerName")
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def customerDetail(request, id):
    try:
        customer = Customer.objects.get(id=id)
    except Customer.DoesNotExist:
        return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)

    if request.method == "PUT":
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# LOCATION CRUD

@api_view(["GET", "POST"])
def locationListCreate(request):
    if request.method == "GET":
        locations = Location.objects.all().order_by("locationName")
        serializer = LocationReadSerializer(locations, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = LocationWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def locationDetail(request, id):
    try:
        location = Location.objects.get(id=id)
    except Location.DoesNotExist:
        return Response({"error": "Location not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = LocationReadSerializer(location)
        return Response(serializer.data)

    if request.method == "PUT":
        serializer = LocationWriteSerializer(location, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        location.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# SERVICE CRUD

@api_view(["GET", "POST"])
def serviceListCreate(request):
    if request.method == "GET":
        services = Service.objects.all().order_by("serviceName")
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def serviceDetail(request, id):
    try:
        service = Service.objects.get(id=id)
    except Service.DoesNotExist:
        return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

    if request.method == "PUT":
        serializer = ServiceSerializer(service, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# CONTRACT CRUD

@api_view(["GET", "POST"])
def contractListCreate(request):
    if request.method == "GET":
        contracts = Contract.objects.all().order_by("contractStart")
        serializer = ContractReadSerializer(contracts, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = ContractWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def contractDetail(request, id):
    try:
        contract = Contract.objects.get(id=id)
    except Contract.DoesNotExist:
        return Response({"error": "Contract not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ContractReadSerializer(contract)
        return Response(serializer.data)


    if request.method == "PUT":
        serializer = ContractWriteSerializer(contract, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        contract.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# JOB CRUD

@api_view(["GET", "POST"])
def jobListCreate(request):
    if request.method == "GET":
        jobs = Job.objects.all().order_by("jobStart")
        serializer = JobReadSerializer(jobs, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = JobWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def jobDetail(request, id):
    try:
        job = Job.objects.get(id=id)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = JobReadSerializer(job)
        return Response(serializer.data)

    if request.method == "PUT":
        serializer = JobWriteSerializer(job, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class DueContractsView(APIView):
    def get(self, request):
        try:
            X = int(request.query_params.get("months", 1))
        except ValueError:
            return Response({"error": "Invalid months parameter"}, status=400)

        contracts = get_due_contracts(X)
        serializer = ContractDueSerializer(contracts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
