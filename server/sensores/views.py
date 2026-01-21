from rest_framework import generics
from .models import Sensor
from .serializers import SensorSerializer

class SensorCreateView(generics.CreateAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer

class SensorListView(generics.ListAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer

class SensorRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer