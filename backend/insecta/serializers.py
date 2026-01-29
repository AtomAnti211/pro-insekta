from rest_framework import serializers

from .models import Activity, Note, Owner,Customer,Location,Service,Contract,Job

class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields ='__all__'
        
class NoteWriteSerializer(serializers.ModelSerializer):
  class Meta:
        model = Note
        fields ='__all__'     
  
class NoteReadSerializer(serializers.ModelSerializer):
  class Meta:
    
        model = Note
        fields ='__all__'  
        depth = 1
         
class ActivitySerializer(serializers.ModelSerializer):
  class Meta:
        model = Activity
        fields ='__all__'   
          
class CustomerSerializer(serializers.ModelSerializer):
  class Meta:
        model = Customer
        fields ='__all__'  
         
class LocationWriteSerializer(serializers.ModelSerializer):
  class Meta:
        model = Location
        fields ='__all__'     
  
class LocationReadSerializer(serializers.ModelSerializer):
  class Meta:
    
        model = Location
        fields ='__all__'  
        depth = 1
         
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields ='__all__'   
               
class ContractReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields ='__all__'  
        depth = 2  
        
class ContractWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields ='__all__'    
        
class JobReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields ='__all__'  
        depth = 3 
        
class JobWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields ='__all__'            