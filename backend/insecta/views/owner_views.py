
from django.http import HttpResponse
from django.template.loader import render_to_string

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from ..models import Owner

from ..serializers import OwnerSerializer


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