from rest_framework import generics
from .models import Sensor
from .serializers import SensorSerializer

class SensorCreateView(generics.CreateAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer