# StickNotesApp# StickNotesApp

StickNotesApp é um aplicativo web para criação e gerenciamento de notas adesivas digitais, permitindo aos usuários organizar suas ideias de forma simples e intuitiva.

## 🚀 Tecnologias Utilizadas

- **Python** (Flask)
- **PostgreSQL** (Banco de Dados)
- **SQLAlchemy** (ORM)
- **Flask-Migrate** (Gerenciamento de Migrações)
- **Docker** (Containerização)
- **HTML, CSS, JavaScript** (Frontend)
- **Bootstrap** (Estilização Responsiva)

## 📦 Configuração do Ambiente

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/StickNotesApp.git
cd StickNotesApp
```

⚙️ Dependências
Docker
Docker Compose

### 2️⃣ Configurar o Banco de Dados

Certifique-se de que o PostgreSQL está rodando e crie o banco:

```sql
CREATE DATABASE notas_adesivas;
```

### 3️⃣ Configurar as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto e adicione:

```env
SECRET_KEY=chave-secreta
FLASK_CONFIG=development
POSTGRES_USER=seu usuário
POSTGRES_PASSWORD=sua senha
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=notas_adesivas
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
TZ=America/Sao_Paulo
```

🛣️ Executando a aplicação

Dentro de /deploy execute o Docker Compose com:

docker compose up -d

### 4️⃣ Instalar as Dependências

```bash
pip install -r requirements.txt
```

### 5️⃣ Rodar as Migrações do Banco de Dados

```bash
flask db upgrade
```

### 6️⃣ Iniciar o Servidor Flask

```bash
flask run
```

O aplicativo estará disponível em **http://127.0.0.1:5000**.

## 🐳 Executando com Docker

Se preferir rodar a aplicação com Docker:

```bash
docker-compose up --build
```

## 📌 Funcionalidades

✅ Criar, editar e excluir notas adesivas
✅ Personalizar cores e categorias das notas
✅ Layout responsivo para dispositivos móveis
✅ Armazenamento seguro com PostgreSQL

## 📄 Licença

Este projeto é de código aberto e está sob a licença MIT. Sinta-se livre para contribuir!

---

Feito com ❤️ por Rosicre Ferreira
Email: rosicreferreira@gmail.com
