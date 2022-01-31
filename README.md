# INE5680 - Tarefa Prática – Criptografia Simétrica, Derivação de chaves e Autenticação

O objetivo dessa aplicação é reproduzir os conceitos aplicados no projeto de serviço [SYNC do browser Mozilla](https://hacks.mozilla.org/2018/11/firefox-sync-privacy/).

Esse projeto possui a seguinte hierarquia de diretórios:

- ENCRYPTION-ASSIGNMENT
  - backend
    - O backend reproduz o servidor da mozilla, sendo responsável por autenticar o usuários e armazenar os dados encriptados dos usuários.
    - Possui como dependência o banco SQL `sqlcipher`, um fork do banco de dados `sqlite` que possui como diferencial a encriptação das tabelas.
  - frontend
    - Possui a lógica de negócio e a camada de apresentação. Para a camada de apresentação foi usado o `readline` módulo do Node.js que permite facilemente criar CLIs e é o responsável por apresentar os menus do sistema e captar as entradas do usuário
  - encryptionTests
    - Arquivo com testes do módulo de criptografia do Node.js: `crypto`

## Requerimentos

Para rodar essa aplicação é necessário ter instalado:
- Node.js (>= v16.13.1) - [Download Node](https://nodejs.org/en/download/)
- NPM ou Yarn (Recomendo o Yarn) - [Download Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)

## Rodando a aplicação
Para rodar pela primeira vez é necessário rodar o seguinte comando na raiz do diretório:

Com o yarn instalado:
`cd backend/ && yarn && cd ../frontend && yarn run start`

Com o npm instalado
`cd backend/ && npm install && cd ../frontend && npm start`

Após rodar o comando no terminal será possível ver a seguinte mensagem: `Starting application`

Em seguida o programa solicitará a senha do banco de dados para inicializar o sistema: `Insert the database password to start the application: `

Insira a senha `password` para inicializar o sistema. Caso a senha inserida seja incorreta o sistema irá quebrar e será necessário rodar o comando `yarn run start` ou `npm start` novamente.

### Navegação nos menus
Os menus da aplicação apresentam números seguidos da respectiva ação como demonstado no próximo item, portanto para navegar entre os menus é necessário digitar o **número correspondente** seguido de enter.

### Menu Principal - Main menu

No menu principal temos as seguintes opções:

#### 1 - Create an user
Para criar um novo usuário, digite 1 no menu principal, logo em seguida o programa pedirá o email e a senha desejada.

Todo usuário cadastrado é autenticado no servidor e depois adicionado no armazemanto local do programa, ou seja, caso você cadastre o usuário com sucesso e encerre o programa, na próxima inicialização será necessário recuperar o usuário que foi salvo no servidor.

Caso você tente cadastrar um usuário que já foi cadastrado anteriormente o programa retornará uma mensagem de erro: `ERROR: This email is already in use`


2 - Access user account

Use esse menu para listar e acessar os usuários salvos no armazenamento local.

Ao listar os usuário o sistema pede que você escolha um usuário da lista, para isso, digite o id e pressione `enter`.

Em seguida será mostrado o menu do usuário que permite as seguintes opções:

1 - Add a new bookmark
  - Permite adicionar um novo favorito à lista de favoritos do usuário

2 - List your bookmarks
  - Lista todos os favoritos do usuário

3 - Logout
  - Sai da conta do usuário, voltando ao menu principal

4 - Exit the application
  - Encerra a aplicação

Caso você tente acessar esse menu, mas não existam usuários salvos localmente o programa retornará a seguinte mensagem: `There isnt any user logged locally, you can try to: Login on Sync to retrieve its data or create a new user`. Portanto, será necessário criar um novo usuário ou selecionar a opção `Login using Sync` para fazer login com as credenciais de um usuário existente.



3 - Login using Sync
Use essa opção para fazer login com um usuário que já foi autenticado previamente. Esse menu pede seu email e senha.

Caso seu login seja feito com sucesso essa mensagem será exibida: `User <email> added to local storage! - Select the menu option: Access user account to login into this account`

4 - Exit the Application

Use essa opção para encerrar a aplicação.
