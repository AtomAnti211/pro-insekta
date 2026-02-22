from django.db import models
from django.utils.timezone import now


class Activity(models.Model):
    activityName = models.CharField(max_length=120)
    activityURL = models.ImageField(upload_to="images/", default=" ", blank=True)
    activityDescr = models.TextField(default=" ")
    activityURL1 = models.ImageField(upload_to="images/", default=" ", blank=True)
    activityURL2 = models.ImageField(upload_to="images/", default=" ", blank=True)
    activityURL3 = models.ImageField(upload_to="images/", default=" ", blank=True)
    def __str__(self):
        return self.activityName

    class Meta:
        verbose_name_plural = "Activities"


class Note(models.Model):
    STATUS_CHOICES = [
        ("new", "Új"),
        ("in_progress", "Folyamatban"),
        ("done", "Kész"),
    ]

    contact_message = models.ForeignKey(
        "ContactMessage",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    noteName = models.CharField(max_length=120)
    noteEmail = models.EmailField(null=True, blank=True)
    notePhone = models.CharField(max_length=20)
    noteAddress = models.CharField(max_length=200, blank=True, default="")
    noteActivity = models.ForeignKey(
        "Activity",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    noteMessage = models.TextField(blank=True, default="")

    noteCreated = models.DateTimeField(default=now)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="new"
    )

    def __str__(self):
        return f"{self.noteName} – {self.get_status_display()}"


class Owner(models.Model):
    ownerName = models.CharField(max_length=150)
    ownerVat = models.CharField(max_length=13, blank=True, default="")
    ownerPostCode = models.SmallIntegerField(default=4000)
    ownerAddress = models.CharField(max_length=100, blank=True, default="")
    ownerWorker = models.CharField(max_length=80, blank=True, default="")
    ownerPermission = models.CharField(max_length=20, blank=True, default="")
    ownerPhone = models.CharField(max_length=20, blank=True, default="")
    ownerMail = models.CharField(max_length=50, blank=True, default="")

    def __str__(self):
        return self.ownerName


class Customer(models.Model):
    customerName = models.CharField(max_length=150)
    customerVat = models.CharField(max_length=13, blank=True, default="")
    customerPostCode = models.SmallIntegerField(default=4000)
    customerCity = models.CharField(max_length=100, blank=True, default="")
    customerAddress = models.CharField(max_length=100, blank=True, default="")
    customerMail = models.CharField(max_length=50, blank=True, default="")

    def __str__(self):
        return self.customerName


class Location(models.Model):
    locationName = models.CharField(max_length=150)
    locationCustomer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    locationPostCode = models.SmallIntegerField(default=4000)
    locationCity = models.CharField(max_length=100, blank=True, default="")
    locationAddress = models.CharField(max_length=100, blank=True, default="")
    locationMail = models.CharField(max_length=50, blank=True, default="")
    locationtyURL = models.ImageField(upload_to="images/", default=" ", blank=True)

    def __str__(self):
        return f"{self.locationCustomer} - {self.locationName}"


class Service(models.Model):
    serviceName = models.CharField(max_length=120)

    def __str__(self):
        return self.serviceName


class Contract(models.Model):
    contractLocationName = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    contractServiceName = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    contractCustomerName = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    contractPrice = models.IntegerField(default=0)
    contractStart = models.DateField(default=now)
    contractValid = models.BooleanField(default=True)
    contractFrequencyMonth = models.IntegerField(default=3)

    def __str__(self):
        return f"{self.contractLocationName} - {self.contractStart}"


class Job(models.Model):
    jobcontractId = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    jobCustomer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    jobLocationName = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    jobServiceName = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    jobPrice = models.IntegerField(default=0)
    jobStart = models.DateField(default=now)
    jobURL = models.ImageField(upload_to="images/", default=" ", blank=True)
    jobRemark = models.CharField(max_length=300, blank=True, default="")
    
    def save(self, *args, **kwargs):
          
        # Ha a Contract ki van választva → automatikusan töltsük a többit
        if self.jobcontractId:

            # 1. Location automatikusan a Contract alapján
            if not self.jobLocationName:
                self.jobLocationName = self.jobcontractId.contractLocationName

            # 2. Service automatikusan a Contract alapján
            if not self.jobServiceName:
                self.jobServiceName = self.jobcontractId.contractServiceName

            # 3. Ha Customer mezőt is szeretnél:
                self.jobCustomer = self.jobcontractId.contractLocationName.locationCustomer

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.jobLocationName} - {self.jobStart.year} - {self.jobStart.month} - {self.jobStart.day}"
    
    class Meta:
        ordering = ["jobLocationName", "-jobStart"]

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    address = models.CharField(max_length=200, blank=True, default="")
    activity = models.ForeignKey(
        Activity,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    message = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} – {self.activity.activityName if self.activity else 'N/A'}"
