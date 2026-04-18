from rest_framework import generics, status
from rest_framework.response import Response
from .models import Movimentacao
from .serializers import MovimentacaoSerializer
from patrimonios.models import Patrimonio

class MovimentacaoCreateView(generics.CreateAPIView):
    queryset = Movimentacao.objects.all()
    serializer_class = MovimentacaoSerializer

class MovimentacaoListView(generics.ListAPIView):
    queryset = Movimentacao.objects.all()
    serializer_class = MovimentacaoSerializer