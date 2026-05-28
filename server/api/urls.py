from django.urls import path
from ambientes.views import (
    AmbienteCreateView,
    AmbienteListView,
    AmbienteRetrieveUpdateDestroyView,
)
from patrimonios.views import (
    PatrimonioCreateView,
    PatrimonioListView,
    PatrimonioRetrieveUpdateDestroyView
)

from sensores.views import (
    SensorCreateView,
    SensorListView,
    SensorRetrieveUpdateDestroyView,
)

from movimentacoes.views import (
    MovimentacaoCreateView,
    MovimentacaoListView
)

urlpatterns = [
    path('ambientes/', AmbienteListView.as_view(), name="listar-ambientes"),
    path('ambientes/criar/', AmbienteCreateView.as_view(), name='criar-ambientes'),
    path('ambientes/<int:pk>/', AmbienteRetrieveUpdateDestroyView.as_view(), name='detalhar-ambiente'),
    path('patrimonios/criar/', PatrimonioCreateView.as_view(), name='criar-patrimonios'),
    path('patrimonios/', PatrimonioListView.as_view(), name='listar-patrimonios'),
    path('patrimonios/<int:pk>/', PatrimonioRetrieveUpdateDestroyView.as_view(), name='detalhar-patrimonio'),
    path('sensores/', SensorListView.as_view(), name='listar-sensores'),
    path('sensores/criar/', SensorCreateView.as_view(), name='criar-sensores'),
    path('sensores/<int:pk>/', SensorRetrieveUpdateDestroyView.as_view(), name='detalhar-sensor'),
    path('movimentacoes/', MovimentacaoListView.as_view(), name='listar-movimentacao'),
    path('movimentacoes/criar/', MovimentacaoCreateView.as_view(), name='criar-movimentacoes'),
]