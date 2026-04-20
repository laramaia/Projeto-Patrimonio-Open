# Projeto Patrimônio: Gestão e Monitoramento de Ativos via RFID
Este projeto é a camada de software responsável por processar, armazenar e visualizar as leituras enviadas por sensores RFID. Ele atua como o ponto central de controle, 
recebendo os sinais EPC (Electronic Product Code) e traduzindo-os em um histórico de movimentação organizado por ambientes e patrimônios.

## Visão Geral
O sistema foi construído com o objetivo de reduzir a latência na identificação de movimentações e eliminar o erro humano no registro de inventário.

Diferente de métodos manuais, esta solução automatiza a captura de dados de hardware RFID, permitindo que a localização de um ativo seja atualizada no banco de dados assim
que ele passa por um sensor. Isso garante que o histórico de movimentação seja fiel ao que acontece fisicamente no ambiente, sem depender de digitação ou conferência física 
constante.

### Funcionalidades
- **Interface de Monitoramento:** Lista dinâmica de movimentações que exibe em tempo real os últimos registros capturados pelos sensores.
- **Gestão de Cadastros:** Controle completo de Ambientes, Sensores e Patrimônios, permitindo o vínculo direto entre o código técnico (EPC) e o item real.
- **Histórico Auditável:** Registro cronológico de entradas e saídas por ambiente, facilitando a rastreabilidade dos ativos da instituição.

### Público-Alvo
O sistema foi projetado para atender instituições governamentais, órgãos públicos e empresas privadas que possuem alta rotatividade de ativos e necessitam de uma camada de auditoria 
automatizada.

## Tecnologias Utilizadas
- **Backend:** Python (Django + Django REST Framework)
- **Frontend:** React (TypeScript + Vite + Tailwind CSS)
- **Banco de Dados:** SQLite (Desenvolvimento)
- **Deploy:** Vercel (Frontend) e Render (Backend)

## Como rodar o projeto
Este projeto possui uma arquitetura dividida em Backend (API) e Frontend (Interface). Para o funcionamento em ambiente de desenvolvimento, ambos precisam estar rodando simultaneamente em terminais locais separados.

### Backend
```bash
# Entre na pasta do servidor
cd server

# Crie o ambiente virtual
python -m venv env
# Ative ambienten virtual no Windows:
.\env\Scripts\activate
# Ative no Linux/Mac:
source env/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Execute as migrações do banco de dados
python manage.py migrate

# Inicie o servidor
python manage.py runserver
```

### Frontend
```bash
# Entre na pasta do cliente
cd client

# Instale as dependências
npm install

# Inicie a aplicação
npm run dev
```
