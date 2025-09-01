# API Filmes

Este projeto é uma aplicação web desenvolvida em Next.js para explorar, buscar e favoritar filmes utilizando a API do TMDB (The Movie Database).

## Funcionalidades
- Listagem de filmes populares e em alta
- Busca de filmes por nome
- Visualização de detalhes de cada filme
- Favoritar/desfavoritar filmes (persistência local)
- Interface responsiva e moderna

## Estrutura de Pastas
- `app/` — Páginas e rotas da aplicação (Next.js App Router)
- `components/` — Componentes reutilizáveis de UI e páginas
- `hooks/` — Hooks customizados para lógica de favoritos, mobile, toast etc.
- `lib/` — Funções utilitárias e integração com a API do TMDB
- `public/` — Imagens e arquivos estáticos
- `styles/` — Arquivos de estilo global

## Como rodar o projeto
1. Instale as dependências:
   ```sh
   pnpm install
   # ou npm install
   ```
2. Configure as variáveis de ambiente:
   - Copie `.env.example` para `.env` e preencha com sua chave da API do TMDB.
3. Rode o servidor de desenvolvimento:
   ```sh
   pnpm dev
   # ou npm run dev
   ```
4. Acesse em `http://localhost:3000`

## Tecnologias
- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- TMDB API

## Observações
- Os favoritos são salvos no localStorage do navegador.
- O projeto utiliza a biblioteca de componentes criados shadcn, localizados em `components/ui`.