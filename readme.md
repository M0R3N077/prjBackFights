# 🥊 BrawlTech - Back-end

Bem-vindo ao repositório do **back-end** do **BrawlTech**, uma plataforma interativa para amantes de lutas!  
Este sistema é responsável por fornecer as funcionalidades essenciais de autenticação, gerenciamento de usuários, postagens, comentários e enquetes, além de integrar-se com o front-end para oferecer uma experiência completa e dinâmica.

## 🔗 Repositório do Front-end

➡️ Acesse o repositório do front-end: [BrawlTech Front-End](https://github.com/seu-usuario/brawlpack-frontend)

---

## ⚙️ Tecnologias Utilizadas

- **Node.js** – Ambiente de execução JavaScript.
- **Express.js** – Framework para construção da API RESTful.
- **MongoDB Atlas** – Banco de dados NoSQL em nuvem.
- **Mongoose** – ODM (Object Data Modeling) para modelagem de dados MongoDB.
- **Bcrypt** – Hash de senhas para autenticação segura.
- **JSON Web Token (JWT)** – Autenticação baseada em token para sessões seguras.

---

## 🗂 Estrutura de Pastas

📁 brawlpack-backend/
├── 📁 controllers # Funções que controlam a lógica principal das rotas
├── 📁 routes # Rotas da API
├── 📁 models # Modelos do MongoDB com Mongoose
├── 📁 middleware # Middlewares como autenticação JWT
├── 📁 utils # Funções utilitárias (ex: validações, helpers)
├── 📄 server.js # Ponto de entrada do servidor
├── 📄 config.js # Configurações da aplicação (ex: conexão MongoDB)
├── 📄 .env # Variáveis de ambiente
├── 📄 package.json # Dependências e scripts
---

## 🔐 Funcionalidades do Back-end

As interações que o back-end suporta incluem:

### 👤 Autenticação de Usuário

- Cadastro de usuários com senha criptografada (Bcrypt)
- Login com geração de token JWT
- Middleware de autenticação para proteger rotas privadas

### 📝 Postagens

- Criar postagens públicas relacionadas às lutas
- Editar e deletar posts (restrito ao autor)
- Curtir e descurtir posts
- Comentar em posts

### 📊 Enquetes

- Criar enquetes relacionadas às lutas
- Votar nas alternativas disponíveis
- Ver resultados da votação

### 🌍 Integração com o Front-end

- Toda a API foi projetada para funcionar de forma integrada com a interface do front-end que simula um mapa 3D com lutas marcadas ao redor do mundo.
- Cada ponto de luta leva a uma página específica com informações detalhadas, interações sociais e sugestões de academias próximas.

---

## 🛠️ Instalação e Uso

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/brawlpack-backend.git
cd brawlpack-backend
