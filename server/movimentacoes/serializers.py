from rest_framework import serializers
from .models import Movimentacao
from patrimonios.models import Patrimonio

class MovimentacaoSerializer(serializers.ModelSerializer):
    epc = serializers.CharField(write_only=True)

    class Meta:
        model = Movimentacao
        fields = ['epc', 'sensor', 'patrimonio', 'from_ambiente', 'to_ambiente', 'timestamp']
        read_only_fields = ['patrimonio', 'from_ambiente', 'to_ambiente']

    def create(self, validated_data):
        epc_lido = validated_data.pop('epc')
        sensor_usado = validated_data['sensor']

        try:
            patrimonio = Patrimonio.objects.get(epc=epc_lido)
        except Patrimonio.DoesNotExist:
            raise serializers.ValidationError({"epc": "Este EPC não está cadastrado no sistema."})

        validated_data['patrimonio'] = patrimonio
        validated_data['from_ambiente'] = sensor_usado.exit_to_ambiente
        validated_data['to_ambiente'] = sensor_usado.entry_to_ambiente

        return super().create(validated_data)