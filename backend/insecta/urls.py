from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

# PUBLIC
from .views.activity_views import activityListCreate, activityDetail
from .views.note_views import noteListCreate, noteDetail
from .views.contact_views import contactMessageCreate

# OWNER
from .views.owner_views import ownerData

# CUSTOMER
from .views.customer_views import customerListCreate, customerDetail

# LOCATION
from .views.location_views import locationListCreate, locationDetail

# SERVICE
from .views.service_views import serviceListCreate, serviceDetail

# CONTRACT
from .views.contract_views import contractListCreate, contractDetail

# JOB
from .views.job_views import jobListCreate, jobDetail

# DUE
from .views.due_views import contractsDueFull

# PDF
from .views.pdf_views import workorder_pdf


urlpatterns = [

    # PUBLIC ENDPOINTS
    path('activities/', activityListCreate),
    path('activities/<int:id>/', activityDetail),

    path('notes/', noteListCreate),
    path('notes/<int:id>/', noteDetail),

    path('contact/', contactMessageCreate),

    # OWNER
    path('owner/', ownerData),

    # CUSTOMERS
    path('customers/', customerListCreate),
    path('customers/<int:id>/', customerDetail),

    # LOCATIONS
    path('locations/', locationListCreate),
    path('locations/<int:id>/', locationDetail),

    # SERVICES
    path('services/', serviceListCreate),
    path('services/<int:id>/', serviceDetail),

    # CONTRACT DUE
    path("contracts/due-full/", contractsDueFull),

    # CONTRACTS
    path('contracts/', contractListCreate),
    path('contracts/<int:id>/', contractDetail),

    # JOBS
    path('jobs/', jobListCreate),
    path('jobs/<int:id>/', jobDetail),

    # PDF
    path("contracts/workorder-pdf/", workorder_pdf, name="workorder_pdf"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
   
       


