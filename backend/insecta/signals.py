from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ContactMessage, Note

@receiver(post_save, sender=ContactMessage)
def create_note_from_contact(sender, instance, created, **kwargs):
    if created:
        Note.objects.create(
            contact_message=instance,
            noteName=instance.name,
            noteEmail=instance.email,
            notePhone=instance.phone,
            noteAddress=instance.address,
            noteActivity=instance.activity,
            noteMessage=instance.message,
            status="new"
        )
