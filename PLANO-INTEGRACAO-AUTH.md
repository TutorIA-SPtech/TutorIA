# Plano de integração de cadastro e login com a API do TutorIA

## Objetivo e limite

Integrar somente cadastro e login aos endpoints existentes, preservando as telas, regras de negócio e navegação do aplicativo. Não incluir login Google nem recuperação de senha.

## Estrutura do frontend analisada

- **Framework e navegação:** React Native com Expo e Expo Router; as telas estão em `app/(public)/` e o layout de navegação fica em `app/_layout.jsx`.
- **Telas de autenticação:** `app/(public)/sign-up.jsx` e `app/(public)/login.jsx` usam componentes nativos, `useState`, estilos locais, `KeyboardAvoidingView` e `ScrollView`. Ambas reutilizam `components/Button.jsx`.
- **Rotas e destino atual:** o cadastro apenas navega para `/onboarding`; o login ainda não executa ação. As telas do onboarding estão em `app/(private)/onboarding/`. A rota inicial em `app/index.jsx` sempre redireciona para `/welcome`.
- **Formulários e validações:** não há submissão para API nem validação implementada nas telas examinadas. Os campos existentes são nome, e-mail e senha.
- **HTTP, ambiente e estado:** não foram encontrados cliente HTTP, configuração de URL de API, contexto/store de autenticação ou configuração `.env` no frontend. Não há dependência Axios; a integração pode usar `fetch` centralizado.
- **Persistência:** não foi encontrada implementação de armazenamento de token. O projeto declara suporte web em `app.json`, além de ser um aplicativo Expo.
- **Testes:** `package.json` não define comandos ou dependências de teste para o frontend. Há um teste Maven no backend, que não cobre diretamente as telas React Native.
- **Backend visível:** a configuração encontrada em `src/main/resources/application.properties` contém somente o nome da aplicação; não foi localizada configuração de CORS nesse material. Será necessário confirmar a origem final da API e validar CORS no backend se o cliente web acessar outra origem.
- **Expo:** o `package.json` declara Expo SDK `~57.0.0`; a documentação versionada solicitada no repositório foi consultada em https://docs.expo.dev/versions/v54.0.0/. As decisões específicas de dependência devem ser confirmadas para a versão efetivamente instalada antes da implementação.

## Proposta de implementação

1. **Configuração da API**
   - Usar `EXPO_PUBLIC_API_URL` como variável de ambiente pública do Expo, sem host ou porta nos componentes.
   - Tratar seu valor como origem/base da API e montar as rotas `/api/v1/auth/sign-up` e `/api/v1/auth/login` no cliente.
   - Fornecer `.env.example` sem credenciais; a URL deve ser alcançável pelo dispositivo/emulador utilizado.

2. **Cliente HTTP centralizado**
   - Usar Axios em um módulo de API centralizado, com serialização JSON e tratamento de erros HTTP/rede.
   - Centralizar no interceptor a leitura do token e a inclusão de `Authorization: Bearer <accessToken>` para requisições futuras autenticadas; chamadas de login e cadastro permanecem públicas.
   - Interpretar ProblemDetail de forma controlada: mapear `fields` para erros dos campos, `EMAIL_ALREADY_REGISTERED` para mensagem de e-mail já utilizado e `401` para credenciais inválidas. Para falhas sem resposta ou inesperadas, exibir mensagem genérica em português, sem detalhes internos.
   - Nunca registrar ou persistir senha, chave de assinatura ou token em logs/analytics; enviar somente os campos definidos no contrato de cada endpoint.

3. **Estado e persistência da autenticação**
   - Criar um contexto React enxuto com estado de autenticação e ações para entrar/sair; disponibilizá-lo no layout raiz.
   - Como não existe padrão atual, usar `expo-secure-store` em iOS/Android para persistir `accessToken` e `tokenType`, verificando compatibilidade com o SDK instalado. Como o projeto também habilita web, definir fallback específico para web (preferencialmente `sessionStorage`, com sessão limitada à aba e aviso explícito de que armazenamento web continua acessível a JavaScript). Não usar `localStorage` como se fosse armazenamento seguro.
   - Expor ação de saída que remova as credenciais persistidas e limpe o estado. Não foi encontrada tela/ação de logout existente para conectar nesta tarefa; não criar uma nova tela fora do escopo.
   - Restaurar o estado de autenticação na inicialização e encaminhar sessão válida para o destino existente, sem alterar regras de acesso do backend.

4. **Formulários e navegação**
   - Cadastro: enviar `name`, `email` e `password`; validar nome obrigatório e até 120 caracteres, e-mail obrigatório/formato válido e senha de 8 a 72 caracteres.
   - Login: enviar apenas `email` e `password`; validar ambos como obrigatórios e o formato do e-mail, sem impor no login a regra de tamanho de senha específica do cadastro.
   - Apresentar erros junto aos campos quando possível, além de estado geral para falhas de rede/API. Limpar ou atualizar erros à medida que a pessoa corrige os campos.
   - Impedir submissões repetidas enquanto a requisição estiver em andamento e tornar carregamento, sucesso e falha visíveis e acessíveis, mantendo os estilos atuais.
   - Em resposta válida, guardar `accessToken` e `tokenType`, atualizar o contexto e substituir a rota atual por `/onboarding`, destino para o qual o cadastro já encaminha hoje. Após confirmação, aplicar o mesmo destino ao login e atualizar o redirecionamento inicial para respeitar a sessão.
   - Estender `components/Button.jsx` somente se necessário para suportar estado desabilitado/carregamento sem quebrar os usos atuais.

5. **Testes e documentação**
   - Testes frontend não foram adicionados conforme solicitado.
   - A URL da API deve ser configurada no backend para permitir CORS quando houver origem web diferente.

## Arquivos previstos para a implementação (após aprovação)

- `app/(public)/login.jsx`
- `app/(public)/sign-up.jsx`
- `app/_layout.jsx` e possivelmente `app/index.jsx`
- `components/Button.jsx`, se precisar aceitar estado de carregamento/desabilitado
- Novos módulos de API, validação e contexto em uma pasta coerente com o projeto, por exemplo `services/` e `contexts/`
- `package.json` e `package-lock.json` somente se for necessária a dependência de armazenamento seguro ou de testes
- `.env.example` e documentação de execução/teste
- Testes focados da lógica adicionada, conforme runner escolhido

## Configuração e validação manual

1. Copie `.env.example` para `.env`, informe `EXPO_PUBLIC_API_URL` sem a barra final e reinicie o Expo. No Android Emulator, `localhost` aponta para o emulador; use o endereço de host correspondente, como `10.0.2.2`, ou o IP da máquina na rede local para dispositivo físico. Não use um host de produção no código-fonte.
2. Envie cadastro com nome, e-mail e senha válidos. A conta é criada por `POST /api/v1/auth/sign-up`; o token é persistido e o app abre `/onboarding`.
3. Saia e entre novamente em `/login`; `POST /api/v1/auth/login` autentica e encaminha ao mesmo destino.
4. Reinicie o aplicativo para confirmar restauração da sessão. iOS/Android usam SecureStore; web mantém o token apenas na sessão da aba via `sessionStorage` (não é proteção contra XSS).
5. Em chamadas futuras ao cliente `apiRequest`, o token persistido será incluído como `Authorization: Bearer <accessToken>`. A ação `signOut` exposta por `useAuth` remove persistência e estado; não foi criada interface de logout porque não havia uma tela/ação existente.
6. Se usar web com a API em outra origem, configure CORS no backend para a origem exata do frontend.

**Status:** integração implementada; os testes automatizados de frontend foram omitidos conforme solicitado.
