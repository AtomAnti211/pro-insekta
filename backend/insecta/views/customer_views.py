from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Customer
from ..insecta_serializers import CustomerSerializer

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