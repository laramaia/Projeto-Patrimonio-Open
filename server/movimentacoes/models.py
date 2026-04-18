from django.db import models, transaction
from patrimonios.models import Patrimonio
from ambientes.models import Ambiente
from sensores.models import Sensor

class Movimentacao(models.Model):
    patrimonio = models.ForeignKey(Patrimonio, on_delete=models.CASCADE, related_name='movimentos')
    from_ambiente = models.ForeignKey(Ambiente, on_delete=models.CASCADE, related_name='movimentos_saida')
    to_ambiente = models.ForeignKey(Ambiente, on_delete=models.CASCADE, related_name='movimentos_entrada')
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='logs')
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.patrimonio.current_ambiente == self.to_ambiente:
            return
        
        # Atualiza o ambiente atual do patrimonio
        with transaction.atomic():
            self.patrimonio.current_ambiente = self.to_ambiente
            self.patrimonio.save()
            super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.patrimonio} -> {self.to_ambiente} via {self.sensor}"
    
    class Meta:
        db_table = 'movement_log'