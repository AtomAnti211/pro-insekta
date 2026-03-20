from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Contract
from ..serializers import ContractReadSerializer,ContractWriteSerializer


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