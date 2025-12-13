from django.db import models
from patrimonios.models import Patrimonio
from ambientes.models import Ambiente
from sensores.models import Sensor

class Movimentações(models.Model):
    patrimonio = models.ForeignKey(Patrimonio, on_delete=models.CASCADE, related_name='movimentos')
    from_ambiente = models.ForeignKey(Ambiente, on_delete=models.CASCADE, related_name='movimentos_saida')
    to_ambiente = models.ForeignKey(Ambiente, on_delete=models.CASCADE, related_name='movimentos_entrada')
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='logs')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patrimonio} -> {self.to_ambiente} via {self.sensor}"