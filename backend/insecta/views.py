from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import (
    Note, Activity, Owner, Customer, Location, Service, Contract, Job
)

from .serializers import (
    ActivitySerializer, NoteReadSerializer, NoteWriteSerializer,
    OwnerSerializer, CustomerSerializer, LocationReadSerializer,
    LocationWriteSerializer, ServiceSerializer,
    ContractReadSerializer, ContractWriteSerializer,
    JobReadSerializer, JobWriteSerializer
)

# ---------------------------------------------------------
# OWNER (READ + UPDATE)
# ---------------------------------------------------------

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


# ---------------------------------------------------------
# ACTIVITY CRUD
# ---------------------------------------------------------

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


# ---------------------------------------------------------
# Note CRUD
# ---------------------------------------------------------

@api_view(["GET", "POST"])
def noteListCreate(request):
    if request.method == "GET":
        notes = Note.objects.all().order_by("-noteCreated")
        serializer = NoteReadSerializer(notes, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = NoteWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def noteDetail(request, id):
    try:
        note = Note.objects.get(id=id)
    except Note.DoesNotExist:
        return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = NoteReadSerializer(note)
        return Response(serializer.data)

    if request.method == "PUT":
        serializer = NoteWriteSerializer(note, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ---------------------------------------------------------
# CUSTOMER CRUD
# ---------------------------------------------------------

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


# ---------------------------------------------------------
# LOCATION CRUD
# ---------------------------------------------------------

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


# ---------------------------------------------------------
# SERVICE CRUD
# ---------------------------------------------------------

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


# ---------------------------------------------------------
# CONTRACT CRUD
# ---------------------------------------------------------

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


# ---------------------------------------------------------
# JOB CRUD
# ---------------------------------------------------------

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
