from django.contrib import admin

# Register your models here.
from .models import Activity, Note, Owner, Customer,Location,Service,Contract,Job,ContactMessage
  # Register your models here.
admin.site.register(Activity)
admin.site.register(Note)
admin.site.register(Owner)
admin.site.register(Customer)
admin.site.register(Location)
admin.site.register(Service)
admin.site.register(Contract)
admin.site.register(Job)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "activity", "created_at")
    list_filter = ("activity", "created_at")
    search_fields = ("name", "email", "phone", "message")
