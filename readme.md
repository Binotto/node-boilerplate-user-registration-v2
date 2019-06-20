Os testes no servidor foram feitos utilizando o programa de teste Postman.
O mesmo está configurado para aceitar os dados no formato JSON.

Para iniciar o processo no modo de Desenvolvimento rode o comando abaixo:(O Nodemon está instalado como uma dependencia de desenvolvimento :D ):


``sh
//npm install
//npm run dev

{{url}}=localhost:3000

Rotas:
////////////
// Adicionar um novo usuário
POST: {{url}}/user
Example:
{
	"name": "Binotto",
	"email": "binottos@example.com",
	"password": "123teste"
}
///////////
//Login
//Necessário fazer o Login para iniciar a autenticação das outras rotas(Menos a da criação de usuário).
POST: {{url}}/users/login
Example:
{
	"email": "binottos@example.com",
	"password": "123teste"
}
///////////////
//Rota para autenticar o token de acesso retornando os dados do usuário
GET: {{url}}/users/me
//////////////
//Buscar os dados de um usuário em especifico
GET: {{url}}/3000/users/:id
Example:
{{url}}/users/5d02f5235753fd0cf2798837
////////////////////
//Buscar a lista de usuários, deletados, não deletados, e também tem a paginação se for necessário
GET: {{url}}/users/
GET /users?deleted=false or true
GET /users?limit=10&skip=20
////////////////////
// Edita um usuário pelo id
PATCH: {{url}}/users/:id
Example:
{{url}}/users/5d02f5235753fd0cf2798837
{
	"age": "25",
	"name": "Matheus Binotto - Back End Web Developer",
	"password": "123testando"
}
////////////////////
// Edita o usuário que está logado, verificando pela autenticação.
PATCH: {{url}}/users/me
Example:
{
	"age": "25",
	"name": "Matheus Binotto - Full Stack Web Developer",
	"password": "123testando"
}
////////////////////
// Remove um usuário pelo id
DELETE: {{url}}/users/:id
Example:
{{url}}/users/5d02f5235753fd0cf2798837
/////////////////////
//Remove o usuário que está logado
DELETE: {{url}}/users/me
//////////////////////
//Filtrar usuários com base em uma query passada pela url
GET: {{url}}/users/filter/:name
Example:
{{url}}/users/filter/Matheus
//////////////////////
```

Todas as requisições acima precisam ser autenticadas pelo token de acesso (com exceção da rota "/login").


Made by Matheus Binotto
https://github.com/Binotto
https://www.linkedin.com/in/matheus-binotto-a51787143/





