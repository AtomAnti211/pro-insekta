from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Location
from ..insecta_serializers import LocationReadSerializer,LocationWriteSerializer

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