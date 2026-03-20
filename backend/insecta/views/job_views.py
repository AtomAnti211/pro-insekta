from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Job
from ..serializers import JobReadSerializer,JobWriteSerializer


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