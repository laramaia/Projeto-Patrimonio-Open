from django.urls import path
from ambientes.views import (
    AmbienteCreateView,
    AmbienteListView,
    AmbienteRetrieveUpdateDestroyView,
)
from patrimonios.views import PatrimonioCreateView

urlpatterns = [
    path('ambientes/', AmbienteListView.as_view(), name="listar-ambientes"),
    path('ambientes/criar/', AmbienteCreateView.as_view(), name='criar-ambientes'),
    path('ambientes/<int:pk>/', AmbienteRetrieveUpdateDestroyView.as_view(), name='detalhar-ambiente'),
    path('patrimonios/criar/', PatrimonioCreateView.as_view(), name='criar-patrimonios'),
]