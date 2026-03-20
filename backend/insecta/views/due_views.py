from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..services import get_contracts_due_0_12

@api_view(["GET"])
def contractsDueFull(request):
    data = get_contracts_due_0_12()
    return Response(data)
