# API Drivencracy

## 📝 Descrição

O objetivo da API Drivencracy é fornecer um sistema simples e direto para criação e votação de enquetes. A API permite que os usuários criem enquetes com opções de voto e registrem seus votos. É uma aplicação de back-end construída em Node.js, utilizando Express.js como framework web e MongoDB para armazenamento de dados.

## ✅ Requisitos

- A porta utilizada pelo servidor deve ser a 5000.
- Versionamento usando Git é obrigatório. Crie um repositório no seu perfil do GitHub.
- Faça commits a cada funcionalidade implementada.
- Utilize dotenv.
- O deploy da API deve ser feito no Render e do banco no MongoDB Atlas.

## Rotas e Funcionalidades

### POST /poll

Esta rota é utilizada para criar uma nova enquete. Recebe no corpo da requisição o título da enquete e a data de expiração (opcional). Retorna a enquete recém-criada em caso de sucesso.

### GET /poll

Retorna a lista de todas as enquetes cadastradas.

### POST /choice

Utilizada para adicionar uma opção de voto a uma enquete existente. Recebe no corpo da requisição o título da opção de voto e o ID da enquete a qual a opção pertence. Retorna a opção de voto criada em caso de sucesso.

### GET /poll/:id/choice

Retorna a lista de opções de voto de uma enquete específica, identificada pelo seu ID.

### POST /choice/:id/vote

Registra um voto em uma opção de voto específica, identificada pelo seu ID. Não recebe dados no corpo da requisição. Retorna status 201 em caso de sucesso.

### GET /poll/:id/result

Retorna o resultado de uma enquete específica, ou seja, a opção de voto mais votada até o momento. Retorna um objeto contendo o título da enquete, a data de expiração e a opção de voto mais votada com a quantidade de votos.
