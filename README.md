:octocat: Este repositório foi desenvolvido em cima do repositório abaixo(Utilizando - MongoDB Pipeline Aggregations):
https://github.com/Binotto/node-boilerplate-user-registration-v1 :octocat:

Comando para efetuar um clone desse repositório:

```sh
 git clone https://github.com/Binotto/node-boilerplate-user-registration-v2.git

```

Instalar as dependencias:

```sh

npm install

```

Para iniciar o processo no modo de Desenvolvimento rode o comando abaixo:


```sh

npm run dev

```

{{url}}=localhost:3000

Novas Rotas:

Apresentação dos nomes dos ultimos usuários que fizeram atualização no DB:

```sh
POST: {{url}}/users/lastUpdates
```
Apresentação dos nomes dos ultimos usuários que fizeram atualização no DB, junto com os ultimos tokens adicionados, e
a ultima data de atualização :
```sh
GET /users/last
GET /users/last?tokens=<number>
```


Buscar a lista de usuários, deletados, não deletados, e também a paginação se for necessário(Atualizado):

```sh
GET: {{url}}/users/
GET /users?deleted=false or true
GET /users?limit=10&skip=20
```

Todos os usuários cadastrados por nome:

```sh
GET /users/allRegisteredUsersByName
```

Todas as requisições acima precisam ser autenticadas pelo token de acesso.


Made by Matheus Binotto
```sh
https://www.linkedin.com/in/matheus-binotto-a51787143/

```




