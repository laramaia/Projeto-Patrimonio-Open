from django.db import models
from ambientes.models import Ambiente

class Patrimonio (models.Model):
    epc = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    last_seen = models.DateTimeField(auto_now=True)
    current_ambiente_id = models.ForeignKey(Ambiente, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name or 'Sem nome'} ({self.epc})"