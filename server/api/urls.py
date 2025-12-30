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
)

urlpatterns = [
    path('ambientes/', AmbienteListView.as_view(), name="listar-ambientes"),
    path('ambientes/criar/', AmbienteCreateView.as_view(), name='criar-ambientes'),
    path('ambientes/<int:pk>/', AmbienteRetrieveUpdateDestroyView.as_view(), name='detalhar-ambiente'),
    path('patrimonios/criar/', PatrimonioCreateView.as_view(), name='criar-patrimonios'),
    path('patrimonios/', PatrimonioListView.as_view(), name='listar-patrimonios'),
    path('patrimonios/<int:pk>/', PatrimonioRetrieveUpdateDestroyView.as_view(), name='detalhar-patrimonio'),
    path('sensores/criar/', SensorCreateView.as_view(), name='criar-sensores'),
]