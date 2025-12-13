from rest_framework import generics
from .models import Ambiente
from .serializers import AmbienteSerializer

# Post
class AmbienteCreateView(generics.CreateAPIView):
    queryset = Ambiente.objects.all()
    serializer_class = AmbienteSerializer

# Get All
class AmbienteListView(generics.ListAPIView):
    queryset = Ambiente.objects.all()
    serializer_class = AmbienteSerializer

# Get By Id, Put, Patch, Delete
class AmbienteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ambiente.objects.all()
    serializer_class = AmbienteSerializer