from django.db import models
from ambientes.models import Ambiente

class Sensor(models.Model):
    name = models.CharField(max_length=255)
    exit_to_ambiente = models.ForeignKey(Ambiente, on_delete=models.CASCADE, related_name='sensores_saida')
    entry_to_ambiente = models.ForeignKey(Ambiente, on_delete=models.CASCADE, related_name='sensores_entrada')

    def __str__(self):
        return self.name