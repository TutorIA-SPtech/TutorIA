# TutorIA

## Integração local com o backend

O frontend usa `EXPO_PUBLIC_API_URL` e os endpoints de autenticação do backend TutorIA:

- `POST /api/v1/auth/sign-up`: cadastro com `name`, `email` e `password`.
- `POST /api/v1/auth/login`: login com `email` e `password`.
- `POST /api/v1/auth/password/recovery`: solicitação de recuperação com `email`.
- `POST /api/v1/auth/google`: autenticação com `{ "idToken": "<token do Google>" }`.

### Iniciar no celular com Expo Go

1. Inicie o backend Spring Boot na porta `8080`.
2. Deixe `EXPO_PUBLIC_API_URL` vazio no `.env` para o script `npm start` detectar um IPv4 privado do computador e usar `http://<IP-LOCAL>:8080`.
3. Conecte computador e celular à mesma rede Wi-Fi.
4. Execute `npm start` (ou `npm run start -- --clear`) e abra o QR Code no Expo Go.
5. Se o script detectar o adaptador de rede errado, configure manualmente `EXPO_PUBLIC_API_URL=http://<IP-CORRETO>:8080` no `.env` e reinicie o Expo.

A detecção automática ajuda no desenvolvimento local, mas não pode garantir a escolha correta quando existem VPNs, adaptadores virtuais ou várias redes ativas. O backend também precisa estar acessível pelo firewall do computador.

O token de acesso é persistido via `expo-secure-store` no iOS/Android. Na web, é mantido em `sessionStorage`, que não é um armazenamento seguro contra XSS. O botão de login Google não é exibido na web.

### Configuração do login com Google

O login Google usa `@react-native-google-signin/google-signin` e não funciona no Expo Go. É necessário gerar um development build ou build de produção depois de configurar os clientes OAuth.

1. No Google Cloud Console, configure a tela de consentimento OAuth.
2. Crie no mesmo projeto os clientes OAuth **Web**, **Android** e **iOS**. Use `com.sptech.tutoria` como package Android e bundle ID iOS.
3. Configure `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` e `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` no `.env`, copiando os valores de cliente correspondentes. O Client ID Web deve ser o mesmo configurado como `GOOGLE_CLIENT_ID` no backend.
4. Para Android, associe ao cliente o SHA-1 do certificado usado no build. O SHA-1 de debug pode ser obtido com `cd android; .\gradlew signingReport`; cadastre também os SHA-1 de release/EAS quando aplicável. O emulador/dispositivo precisa ter Google Play Services.
5. Gere novamente o app nativo com `npx expo run:android` ou `npx expo run:ios` (iOS requer macOS), ou use um EAS Build. A configuração Expo deriva o URL scheme iOS invertido a partir de `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`.

O app envia somente o `idToken` ao backend; não decodifica nem confia nos dados do perfil do cliente.

O fluxo completo de redefinição de senha (consumir token e definir nova senha) ainda depende de implementação específica de UI/cliente.
