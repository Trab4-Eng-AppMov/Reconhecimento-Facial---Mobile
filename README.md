# App Receitas

Aplicativo de receitas em React Native (Expo) com autenticação e banco de dados Firebase.

## Funcionalidades

- Login e cadastro de usuários (Firebase Auth)
- CRUD de perfil do usuário (coleção `usuarios`)
- CRUD de receitas (coleção `receitas`)
- Navegação por abas entre Perfil e Receitas
- Logout

## Stack

- Expo SDK 54
- React Native
- Firebase 10.13.2 (sintaxe compat / v8)
- React Navigation
- React Native Paper

## Como rodar

1. Instale as dependências:

   ```
   npm install
   ```

2. Configure o Firebase (veja abaixo).

3. Inicie o projeto:

   ```
   npm start
   ```

4. Abra no app Expo Go (escaneie o QR Code) ou em um emulador.

## Configuração do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e crie um projeto.

2. No projeto, ative:
   - **Authentication** > método **Email/senha**.
   - **Cloud Firestore** > criar banco em modo de teste.

3. Em **Configurações do projeto** > **Seus apps**, registre um app Web e copie as credenciais.

4. Abra o arquivo `src/firebaseConfig.js` e substitua os placeholders pelas suas credenciais:

   ```js
   const firebaseConfig = {
     apiKey: "SUA_API_KEY_AQUI",
     authDomain: "SEU_AUTH_DOMAIN_AQUI",
     projectId: "SEU_PROJECT_ID_AQUI",
     storageBucket: "SEU_STORAGE_BUCKET_AQUI",
     messagingSenderId: "SEU_MESSAGING_SENDER_ID_AQUI",
     appId: "SEU_APP_ID_AQUI"
   };
   ```

## Estrutura

```
App.js                  Navegação principal e controle de autenticação
src/
  firebaseConfig.js     Configuração e inicialização do Firebase
  screens/
    LoginScreen.js      Tela de login
    CadastroScreen.js   Tela de cadastro
    HomeScreen.js       Abas (Receitas / Perfil)
    PerfilScreen.js     CRUD do perfil do usuário
    ReceitasScreen.js   CRUD de receitas
```
