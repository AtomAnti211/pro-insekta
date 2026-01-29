from django.contrib import admin

# Register your models here.
from .models import Activity, Note, Owner, Customer,Location,Service,Contract,Job
  # Register your models here.
admin.site.register(Activity)
admin.site.register(Note)
admin.site.register(Owner)
admin.site.register(Customer)
admin.site.register(Location)
admin.site.register(Service)
admin.site.register(Contract)
admin.site.register(Job)