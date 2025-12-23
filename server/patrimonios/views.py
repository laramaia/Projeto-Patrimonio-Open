from rest_framework import generics
from .models import Patrimonio
from .serializers import PatrimonioSerializer

class PatrimonioCreateView(generics.CreateAPIView):
    queryset = Patrimonio.objects.all()
    serializer_class = PatrimonioSerializer

class PatrimonioListView(generics.ListAPIView):
    queryset = Patrimonio.objects.all()
    serializer_class = PatrimonioSerializer