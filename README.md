<h1 align="center" style="font-weight: bold;">MarcaHora</h1>

<div align="center">
    <img src="./apps/web/public/logo.png" width="200" style="padding: 16px;">
</div>

<p align="center">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white" alt="Bun">
  <img src="https://img.shields.io/badge/turborepo-%23EF4444.svg?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo">
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres">
  <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest">
  <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="NextJS">
  <img src="https://img.shields.io/badge/shadcn/ui-%23000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="Shadcn">
  <img src="https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="Native">
  <img src="https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37" alt="Expo">
  <img src="https://img.shields.io/badge/Drizzle-%23000000?style=for-the-badge&logo=drizzle&logoColor=C5F74F" alt="Drizzle">
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
</p>

<p align="center">
 <a href="#estrutura">Estrutura do projeto</a> • 
 <a href="#inicio">Primeiros Passos</a> • 
 <a href="#interacao">Interação</a> •
 <a href="#contribuir">Contribuir</a>
</p>

<p align="center">
  <b>MarcaHora é uma plataforma de gestão de eventos que permite criar/editar/publicar eventos com capacidade, múltiplos lotes de ingressos e controle fino de disponibilidade. O fluxo de reserva verifica vagas e gera um código/QR único para confirmação. O sistema inclui controle de concorrência, fila de espera com notificação ao liberar vaga, pagamentos vinculados a reservas, notificações agendadas por e-mail/push e painel do organizador com lista de reservas, check-in (QR ou lista) e exportação CSV. Relatórios oferecem taxa de ocupação, receita por evento e conversão por canal, e o modelo de permissões suporta Administrador, Organizador (com equipe) e Usuário/Convidado, garantindo integridade e auditoria via o esquema relacional.
  </b>
</p>

<h2 id="estrutura">📂 Estrutura do projeto</h2>

```yaml
├── apps/
│   ├── fumadocs/ # Documentação
│   ├── web/      # Projeto web (Next.js + Shadcn UI)
│   ├── native/   # Projeto mobile (React Native + Expo)
│   └── server/   # Projeto backend (Nest.js + Drizzle)
│
├── packages/
│   ├── auth/     # Autenticação com Better Auth
│   ├── db/       # Banco de dados PostgreSQL
│   └── env/      # Variáveis de ambiente
```

<h2 id="inicio">🚀 Primeiros Passos</h2>

<h3>Pré-requisitos</h3>

- [Bun](https://bun.com/docs/installation)

<h3>Clonando</h3>

```bash
git clone https://github.com/gabrieudev/marcahora.git
```

<h3>Variáveis de Ambiente</h3>

Crie arquivos `.env` nos seguintes diretórios:

`/apps/server`

```bash
BETTER_AUTH_SECRET=SECRET_BETTER_AUTH
BETTER_AUTH_URL=SERVER_BASE_URL
CORS_ORIGIN=WEB_BASE_URL
DATABASE_URL=DATABASE_URL
DATABASE_URL_DIRECT=DATABASE_URL_DIRECT
PORT=PORT
```

`/apps/web`

```bash
NEXT_PUBLIC_SERVER_URL=SERVER_BASE_URL
```

<h3>Inicializando</h3>

Execute os seguintes comandos:

```bash
cd marcahora
bun install
bun run dev
```

<h2 id="interacao">🌐 Interação</h2>

Agora, você poderá interagir com a aplicação das seguintes formas:

- Interface: [http://localhost:3001](http://localhost:3001)
- Servidor: [http://localhost:3000](http://localhost:3000)
- Documentação: [http://localhost:4000](http://localhost:4000)

<h2 id="contribuir">📫 Contribuir</h2>

Contribuições são muito bem vindas! Caso queira contribuir, faça um fork do repositório e crie um pull request.

1. `git clone https://github.com/gabrieudev/marcahora.git`
2. `git checkout -b feature/NOME`
3. Siga os padrões de commits.
4. Abra um Pull Request explicando o problema resolvido ou a funcionalidade desenvolvida. Se houver, anexe screenshots das modificações visuais e aguarde a revisão!
