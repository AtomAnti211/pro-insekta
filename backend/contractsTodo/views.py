from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from insecta.services import get_due_contracts
from insecta.serializers import ContractDueSerializer


class DueContractsView(APIView):
    def get(self, request):
        try:
            X = int(request.query_params.get("months", 1))
        except ValueError:
            return Response({"error": "Invalid months parameter"}, status=status.HTTP_400_BAD_REQUEST)

        contracts = get_due_contracts(X)
        serializer = ContractDueSerializer(contracts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
from django.shortcuts import render

# Create your views here.
