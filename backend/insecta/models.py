from django.db import models
from django.utils.timezone import now


# Create your models here.
class Activity(models.Model):
  activityName=models.CharField(max_length=120)
  activityURL = models.ImageField(upload_to="images/", default =' ')
  activityDescr  = models.TextField(default=" ")
  
  def __str__(self):
    return self.activityName
  class Meta:
    verbose_name_plural = "Activities"

class Note (models.Model):
  noteName = models.CharField(max_length=120, null=False)
  noteActivity = models.ForeignKey(Activity,on_delete=models.CASCADE) 
  notePhone =models.CharField(max_length=20, null=False)
  noteAddress=models.CharField(max_length=200)
  noteCreated =models.DateTimeField(default=now)
  noteFinished=models.BooleanField(default=False)
  
  
  def __str__(self):
    return f"{self.noteActivity} - {self.noteName}"


class Owner(models.Model): 
  ownerName =models.CharField(max_length=150,null=False)
  ownerVat =models.CharField(max_length=13)
  ownerPostCode= models.SmallIntegerField(default=4000)
  ownerAddress = models.CharField(max_length=100)
  ownerWorker  = models.CharField(max_length=80)
  ownerPermission =models.CharField(max_length=20)
  ownerPhone =models.CharField(max_length=20)
  ownerMail =models.CharField(max_length=20,)
  def __str__(self):
    return self.ownerName
  
class Customer(models.Model): 
  customerName =models.CharField(max_length=150,null=False)
  customerVat =models.CharField(max_length=13)
  customerPostCode= models.SmallIntegerField(default=4000)
  customerCity = models.CharField(max_length=100)
  customerAddress = models.CharField(max_length=100)
  customerMail =models.CharField(max_length=50,)
  def __str__(self):
    return self.customerName
  
class Location(models.Model): 
  locationName =models.CharField(max_length=150,null=False)
  locationCustomer= models.ForeignKey(Customer,on_delete=models.CASCADE)
  locationPostCode= models.SmallIntegerField(default=4000)
  locationCity = models.CharField(max_length=100)
  locationAddress = models.CharField(max_length=100)
  locationMail =models.CharField(max_length=50,)
  locationtyURL= models.ImageField(upload_to="images/", default =' ')
  def __str__(self):
      return f"{self.locationCustomer} - {self.locationName}"
    
class Service(models.Model):
  serviceName=models.CharField(max_length=120)
  def __str__(self):
    return self.serviceName
  
class Contract(models.Model): 
  contractLocationName= models.ForeignKey(Location,on_delete=models.CASCADE)
  contractServiceName=models.ForeignKey(Service,on_delete=models.CASCADE)
  contractPrice  = models.IntegerField()
  contractStart = models.DateField(default =now)
  contractValid = models.BooleanField(default=True)
  contractFrequencyMonth = models.IntegerField(default=3)
  def __str__(self):
      return f"{self.contractLocationName} - {self.contractStart}"
  
class Job(models.Model): 
    jobLocationName = models.ForeignKey(Location, on_delete=models.CASCADE)
    jobServiceName = models.ForeignKey(Service, on_delete=models.CASCADE)
    jobPrice = models.IntegerField()
    jobStart = models.DateField(default=now)
    jobURL = models.ImageField(upload_to="images/", default=' ')

    def __str__(self):
        return f"{self.jobLocationName} - {self.jobStart.year} - {self.jobStart.month} - {self.jobStart.day}"
