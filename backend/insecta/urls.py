from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [

    # PUBLIC ENDPOINTS (no auth required)
    
    # Activities (public)
    path('activities/', views.activityListCreate),
    path('activities/<int:id>/', views.activityDetail),
    path('notes/', views.noteListCreate),
    path('notes/<int:id>/', views.noteDetail),   
    path('contact/', views.contactMessageCreate),


    # ADMIN ENDPOINTS (will require JWT auth)

    # Owner
    path('owner/', views.ownerData),

    # Customers
    path('customers/', views.customerListCreate),
    path('customers/<int:id>/', views.customerDetail),

    # Locations
    path('locations/', views.locationListCreate),
    path('locations/<int:id>/', views.locationDetail),

    # Services
    path('services/', views.serviceListCreate),
    path('services/<int:id>/', views.serviceDetail),

    # Contracts
    path('contracts/', views.contractListCreate),
    path('contracts/<int:id>/', views.contractDetail),
    
    #path("admin/ajax/contract/<int:pk>/", views.ajax_contract_details, name="ajax_contract_details"),


    # Jobs
    path('jobs/', views.jobListCreate),
    path('jobs/<int:id>/', views.jobDetail),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
