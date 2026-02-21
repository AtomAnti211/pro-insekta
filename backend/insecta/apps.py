from django.apps import AppConfig

class InsectaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'insecta'

    def ready(self):
        import insecta.signals
