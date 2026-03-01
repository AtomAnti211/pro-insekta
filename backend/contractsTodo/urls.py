from django.urls import path
from .views import DueContractsView

urlpatterns = [
    path("due/", DueContractsView.as_view(), name="due-contracts"),
]
