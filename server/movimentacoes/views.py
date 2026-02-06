from rest_framework import generics, status
from rest_framework.response import Response
from .models import Movimentacao
from .serializers import MovimentacaoSerializer
from patrimonios.models import Patrimonio

class MovimentacaoCreateView(generics.CreateAPIView):
    queryset = Movimentacao.objects.all()
    serializer_class = MovimentacaoSerializer

    def create(self, request, *args, **kwargs):
        # cria o log
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        movimentacao = serializer.save()

        # atualiza o patrimonio
        patrimonio = movimentacao.patrimonio
        patrimonio.current_ambiente = movimentacao.to_ambiente
        patrimonio.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MovimentacaoListView(generics.ListAPIView):
    queryset = Movimentacao.objects.all()
    serializer_class = MovimentacaoSerializer