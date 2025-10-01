NotaFlash ⚡️
NotaFlash é um sistema de gerenciamento de pedidos projetado para otimizar e centralizar o fluxo de trabalho de pequenos e médios comércios. A plataforma oferece uma solução simples para organizar pedidos, gerenciar clientes e agilizar o atendimento, tudo em um único lugar.

Este projeto foi desenvolvido como Projeto Integrador, utilizando a stack MERN (MongoDB, Express, React, Node.js).

Tecnologias Utilizadas
O projeto é dividido em duas partes principais: o backend e o frontend.

Backend:

Node.js: Ambiente de execução do JavaScript no servidor.

Express.js: Framework para a construção da API REST.

MongoDB: Banco de dados NoSQL para armazenar os dados.

Mongoose: ODM para modelar e interagir com o MongoDB.

Frontend:

React: Biblioteca para a construção da interface de usuário.

Vite: Ferramenta de build para um desenvolvimento frontend rápido.

React Router Dom: Para gerenciamento de rotas e navegação.

React Icons: Para utilização de ícones na interface.

Começando
Para rodar este projeto localmente, siga os passos abaixo.

Pré-requisitos
Node.js (versão LTS recomendada)

Git

Uma connection string do MongoDB Atlas (ou uma instância local do MongoDB).

Instalação
Clone o repositório:

Bash

git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
Navegue até a pasta do projeto:

Bash

cd notaflash
Instale as dependências do Backend:

Bash

cd backend
npm install
Configure as Variáveis de Ambiente do Backend:

Na pasta backend, crie um arquivo chamado .env.

Adicione a sua string de conexão do MongoDB nele:

MONGO_URI=SUA_CONNECTION_STRING_AQUI
Instale as dependências do Frontend:

Em outro terminal, navegue até a pasta frontend.

Bash

cd frontend
npm install
Rodando o Projeto
Para iniciar a aplicação, você precisará de dois terminais abertos: um para o backend e um para o frontend.

Para iniciar o servidor Backend:

No terminal da pasta backend, rode:

Bash

npm run dev
O servidor estará disponível em http://localhost:5000.

Para iniciar a aplicação Frontend:

No outro terminal, na pasta frontend, rode:

Bash

npm run dev
A aplicação React estará disponível em http://localhost:5173 (ou outra porta indicada pelo Vite).