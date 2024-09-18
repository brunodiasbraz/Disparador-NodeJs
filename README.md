# Backend do disparador

## Instalar todas as dependencias indicada pelo package.json
```
npm install
```
## Criar a base de dados no MySQL
## Alterar as credencias do banco de dados no arquivo ".env"

## Executar as migrations
```
npx sequelize-cli db:migrate
```
## Rodar o projeto
```
node app.js
```

## Rodar o projeto usando o nodemon
```
nodemon app.js
```

## Abrir o endereço no navegador para acessar a página inicial
```
http://localhost:3000
```

## Comando SQL para criar a base de dados
```
CREATE DATABASE disparador_nodejs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Criar a Models users
```
npx sequelize-cli model:generate --name Users --attributes cpf:string,nome:string,email:string,endereco:string
```