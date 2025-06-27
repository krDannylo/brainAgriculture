# Brain Agriculture

Este é um projeto backend desenvolvido com NestJS para gerenciamento de produtores rurais e suas propriedades.

## 💻 Tecnologias

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Docker](https://www.docker.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [JWT](https://jwt.io/) - Autenticação
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js/) - Hash de senhas
- [Helmet](https://helmetjs.github.io/) - Segurança
- [Winston](https://github.com/winstonjs/winston) - Logging
- [Throttler](https://docs.nestjs.com/security/rate-limiting) - Rate Limiting

## 🚀 Como executar o projeto

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### 🎲 Rodando a aplicação

1. Clone o repositório
```bash
git clone https://github.com/krDannylo/brainAgriculture.git
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
- Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/brain_agriculture?schema=public"
JWT_SECRET=sua_chave_secreta_jwt
PORT=3000
```

4. Configure o banco de dados
```bash
# Para desenvolvimento (reset rápido)
npm run db:drop

# Para produção (com migrações)
npm run db:rebuild
```

5. Inicie a aplicação
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run start:prod
```

A aplicação estará disponível em `http://localhost:3000`

### 🔥 Rodando com Docker

Se preferir rodar com Docker:

1. Configure um arquivo `.env.docker` com as variáveis de ambiente
2. Execute:
```bash
docker-compose up -d
```

A aplicação estará disponível em `http://localhost:3001`

ou


A aplicação estará disponível em `http://localhost:80` caso execute o docker-compose.prod.yml

## 📝 Scripts disponíveis

- `npm run build`: Compila o projeto
- `npm run start`: Inicia o projeto em modo de produção
- `npm run start:dev`: Inicia o projeto em modo de desenvolvimento com hot-reload
- `npm run test`: Executa os testes unitários
- `npm run test:e2e`: Executa os testes end-to-end
- `npm run test`: Executa os testes unitários e end-to-end
- `npm run db:drop`: Reseta o banco de dados e executa o seed
- `npm run db:rebuild`: Remove migrações, cria nova migração e executa o seed

## 🔐 Autenticação

O sistema utiliza JWT para autenticação. Todas as rotas (exceto health checks) requerem autenticação.

### Login
**Rota:** `POST /auth/signin`

```json
{
  "email": "admin@admin.com",
  "password": "admin"
}
```

### Resposta
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

## 🛡️ Segurança

- **Rate Limiting**: 60 requisições por minuto, com bloqueio de 30 segundos
- **Helmet**: Headers de segurança configurados
- **Sanitização**: Todos os inputs são sanitizados automaticamente
- **Validação**: Validação robusta com class-validator
- **CORS**: Configurado para permitir requisições cross-origin

## 🏥 Health Checks

- `GET /health`: Status completo da aplicação
- `GET /health/ready`: Verificação de readiness (conectividade com banco)

## 📦 Estrutura do Projeto

Aqui a ideia foi manter o padrão de arquitetura e boas práticas do NestJS.
```
src/
├── common/           # Utilitários e decorators comuns
├── module/           # Módulos da aplicação
│   ├── auth/         # Autenticação JWT
│   ├── farmer/       # Gerenciamento de produtores
│   ├── farm/         # Gerenciamento de propriedades
│   ├── harvestSeason/# Gerenciamento de safras
│   ├── crop/         # Gerenciamento de culturas
│   ├── dashboard/    # Dashboard com estatísticas
│   ├── health/       # Health checks
│   └── prisma/       # Configuração do Prisma
├── mocks/            # Dados mock para testes
└── main.ts           # Arquivo principal
```

## 🛠 Documentação da API

A documentação da API está disponível através do Swagger UI em:
```
/docs
```

### 🤔 Qual a ideia e como as rotas funcionam?

O projeto será iniciado com **dados de exemplo no banco de dados** (via seed), incluindo um usuário admin para autenticação.

**Credenciais padrão:**
- Email: `admin@admin.com`
- Senha: `admin`

---

## 🔐 Autenticação

Primeiro, faça login para obter o token JWT:

**Rota:** `POST /auth/signin`

```json
{
  "email": "admin@admin.com",
  "password": "admin"
}
```

Use o token retornado no header `Authorization: Bearer <token>` para todas as outras requisições.

---

## 1️⃣ Criar um Produtor

**Rota:** `POST /farmers`

**Headers:** `Authorization: Bearer <token>`

**Body de exemplo:**

```json
{
  "name": "Farmer Productor",
  "document": "672.996.930-03",
  "email": "farmer@example.com",
  "password": "senha123"
}
```

**Retorno:**

```json
{
  "id": 2,
  "name": "Farmer Productor",
  "document": "672.996.930-03",
  "email": "farmer@example.com",
  "createdAt": "2025-06-09T17:33:10.286Z",
  "updatedAt": "2025-06-09T17:33:10.286Z"
}
```

---

## 2️⃣ Criar uma Propriedade Rural

**Rota:** `POST /farms`

**Headers:** `Authorization: Bearer <token>`

**Body de exemplo:**

```json
{
  "name": "Farm Property",
  "city": "São Paulo",
  "state": "SP",
  "totalArea": 4,
  "arableArea": 3,
  "vegetationArea": 1,
  "farmerId": 2
}
```

**Retorno:**

```json
{
  "id": 1,
  "name": "Farm Property",
  "city": "São Paulo",
  "state": "SP",
  "totalArea": 4,
  "arableArea": 3,
  "vegetationArea": 1,
  "farmerId": 2,
  "createdAt": "2025-06-09T17:28:06.226Z",
  "updatedAt": "2025-06-09T17:28:06.226Z"
}
```

---

## 3️⃣ Criar uma Safra

**Rota:** `POST /harvests`

**Headers:** `Authorization: Bearer <token>`

**Body de exemplo:**

```json
{
  "year": "2023",
  "farmId": 1
}
```

**Retorno:**

```json
{
  "id": 1,
  "year": "2023",
  "farmId": 1,
  "createdAt": "2025-06-09T17:39:27.484Z",
  "updatedAt": "2025-06-09T17:39:27.484Z"
}
```

---

## 4️⃣ Criar uma Cultura

**Rota:** `POST /crops`

**Headers:** `Authorization: Bearer <token>`

**Body de exemplo:**

```json
{
  "name": "Soja",
  "harvestSeasonId": 1
}
```

**Retorno:**

```json
{
  "id": 1,
  "name": "Soja",
  "harvestSeasonId": 1,
  "createdAt": "2025-06-09T17:29:04.736Z",
  "updatedAt": "2025-06-09T17:29:04.736Z"
}
```

---

## 📄 Paginação

Todas as rotas GET de listagem suportam paginação:

**Rota:** `GET /farmers?page=1&limit=10`

**Parâmetros:**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10, máximo: 100)

**Retorno:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Farmer Productor",
      "document": "672.996.930-03",
      "email": "farmer@example.com",
      "createdAt": "2025-06-09T05:22:50.981Z",
      "updatedAt": "2025-06-09T05:23:41.976Z",
      "farms": [...]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Consultar os Dados do Agricultor com Todas as Relações

**Rota:** `GET /farmers`

**Headers:** `Authorization: Bearer <token>`

**Retorno esperado:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Farmer Productor",
      "document": "672.996.930-03",
      "email": "farmer@example.com",
      "createdAt": "2025-06-09T05:22:50.981Z",
      "updatedAt": "2025-06-09T05:23:41.976Z",
      "farms": [
        {
          "id": 1,
          "name": "Farm Property",
          "city": "São Paulo",
          "state": "SP",
          "totalArea": 4,
          "arableArea": 3,
          "vegetationArea": 1,
          "farmerId": 1,
          "createdAt": "2025-06-09T17:28:06.226Z",
          "updatedAt": "2025-06-09T17:28:24.911Z",
          "harvestSeasons": [
            {
              "id": 1,
              "year": "2023",
              "farmId": 1,
              "createdAt": "2025-06-09T17:28:56.231Z",
              "updatedAt": "2025-06-09T17:28:56.231Z",
              "crops": [
                {
                  "id": 1,
                  "name": "Soja",
                  "harvestSeasonId": 1,
                  "createdAt": "2025-06-09T17:29:04.736Z",
                  "updatedAt": "2025-06-09T17:29:04.736Z"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### Por fim temos rota de Dashboard e Docs (Swagger)

**Rota:** `GET /dashboard`

**Headers:** `Authorization: Bearer <token>`

**Retorno:**

```json
{
  "totalFarms": 1,
  "totalHectares": 4,
  "farmsByState": [
    {
      "_count": 1,
      "state": "SP"
    }
  ],
  "cropsByCulture": [
    {
      "_count": 1,
      "name": "Soja"
    }
  ],
  "landUsage": {
    "arable": 3,
    "vegetation": 1
  }
}
```

**Rota:** `GET /docs`
#### Para consultar o SWAGGER

---

## 🧪 Testes

O projeto inclui testes unitários e end-to-end:

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

---

## 🤝 Diagrama de Entidade Relacionamento

Abaixo está a modelagem de dados utilizada neste projeto, representando as entidades principais e seus relacionamentos.

### 🧱 Entidades e Atributos

- **USER**
  - `id` (PK): Identificador do usuário
  - `email`: Email do usuário
  - `password`: Senha criptografada
  - `role`: Role do usuário (admin, farmer)

- **FARMER**
  - `id` (PK): Identificador do agricultor
  - `name`: Nome do agricultor
  - `document`: Documento (CPF/CNPJ)
  - `email`: Email do agricultor
  - `password`: Senha criptografada

- **FARM**
  - `id` (PK): Identificador da fazenda
  - `name`: Nome da fazenda
  - `city`: Cidade onde está localizada
  - `state`: Estado
  - `totalArea`: Área total da fazenda
  - `arableArea`: Área agricultável
  - `vegetationArea`: Área de vegetação
  - `farmerId` (FK): Referência ao agricultor (FARMER)

- **HARVESTSEASON**
  - `id` (PK): Identificador da safra
  - `year`: Ano da safra
  - `farmId` (FK): Referência à fazenda (FARM)

- **CROP**
  - `id` (PK): Identificador da cultura
  - `name`: Nome da cultura
  - `harvestSeasonId` (FK): Referência à safra (HARVESTSEASON)

```mermaid
erDiagram
    USER ||--o{ FARMER : manages
    FARMER ||--o{ FARM : has
    FARM ||--o{ HARVESTSEASON : has
    HARVESTSEASON ||--o{ CROP : has

    USER {
        int id PK
        string email
        string password
        string role
    }
    FARMER {
        int id PK
        string name
        string document
        string email
        string password
    }
    FARM {
        int id PK
        string name
        string city
        string state
        float totalArea
        float arableArea
        float vegetationArea
        int farmerId FK
    }
    HARVESTSEASON {
        int id PK
        string year
        int farmId FK
    }
    CROP {
        int id PK
        string name
        int harvestSeasonId FK
    }
```

![alt text](image-1.png)

Com isso, temos uma cadeia de relacionamentos funcionando:

- `User` gerencia `Farmer(s)`
- `Farmer` possui uma ou mais `Farm(s)`
- Cada `Farm` possui `HarvestSeason(s)`
- Cada `HarvestSeason` possui `Crop(s)`

## 📊 Funcionalidades Implementadas

☑️ **Autenticação JWT** - Sistema completo de login com roles

☑️ **Health Checks** - Monitoramento de saúde da aplicação

☑️ **Paginação** - Todas as rotas de listagem com paginação

☑️ **Sanitização** - Proteção contra XSS em todos os inputs

☑️ **Rate Limiting** - Proteção contra ataques de força bruta

☑️ **Validação** - Validação robusta com class-validator

☑️ **Logging** - Sistema de logs com Winston

☑️ **Testes** - Testes unitários e e2e completos

☑️ **Documentação** - Swagger UI integrado

☑️ **Segurança** - Helmet, CORS, validação de CPF/CNPJ

☑️ **Seed** - Dados de exemplo para desenvolvimento

## 🔮 Próximas Melhorias

## ⚡Sobre os Novos Requisitos

### Segurança

✅ Implementar autenticação JWT

✅ Implementar Helmet para proteção de headers

✅ Adicionei Throttle

✅ Validação de dados

✅ Adição forbidUnknownValues: true,

✅ Implementar sanitização de inputs

✅ Adicionar validação de tipos mais rigorosa

✅ Adição de roles (admin, farmer)

### DevOps

✅ Implementar GitHub Actions

✅ Adicionar docker-compose.prod.yml

✅ Adicionar health checks

### Testes

✅ Aumentar cobertura de testes para > 80%

Implementar testes e2e com Supertest

Adicionar testes de integração

Implementar testes de carga

Melhorar mocks para testes

Implementar factories para dados de teste

Adicionar cenários de erro

### Observabilidade

✅ Adicionar endpoints de health check

Configurar alertas

Performance

✅ Implementar paginação para rotas

✅ Documentação

Documentar códigos de erro

Documentar decisões de arquitetura

Processo de deploy

## 🧟 Considerações Finais

Este projeto foi desenvolvido utilizando o software HTTPie para realização de requisições, o arquivo `httpie-space-incognito-space` é a collection que foi criada e exportada para facilitar a utilização das rotas, para utilizar basta baixar o software HTTPie e importar esse arquivo.

