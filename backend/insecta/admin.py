from django.contrib import admin
from django import forms


# Register your models here.
from .models import Activity, Note, Owner, Customer,Location,Service,Contract,Job,ContactMessage
 
class JobAdminForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = "__all__"
        widgets = {
            "jobLocationName": forms.Select(attrs={"disabled": True}),
            "jobCustomer": forms.Select(attrs={"disabled": True}),
            "jobServiceName": forms.Select(attrs={"disabled": True}),
        }


class JobAdmin(admin.ModelAdmin):
    form = JobAdminForm
    #readonly_fields = ("jobLocationName", "jobCustomer", "jobServiceName")
    readonly_fields = ()

    class Media:
        css = {
            "all": ("admin/css/widgets.css",)
        }
        js = (
            "admin/js/vendor/select2/select2.full.min.js",
            "admin/js/jquery.init.js",
            "admin/js/autocomplete.js",
            "js/job_admin.js",   # saját JS fájl
        )
class JobAdmin(admin.ModelAdmin):
    form = JobAdminForm

    class Media:
        js = ("insecta/js/job_admin.js",)
 
  # Register your models here.
admin.site.register(Activity)
admin.site.register(Note)
admin.site.register(Owner)
admin.site.register(Customer)
admin.site.register(Location)
admin.site.register(Service)
admin.site.register(Contract)
admin.site.register(Job,JobAdmin)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "activity", "created_at")
    list_filter = ("activity", "created_at")
    search_fields = ("name", "email", "phone", "message")
