from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Activity
from ..serializers import ActivitySerializer

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