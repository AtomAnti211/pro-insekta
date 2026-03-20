from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Service
from ..serializers import ServiceSerializer

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