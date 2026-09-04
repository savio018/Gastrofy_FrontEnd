# Gastrofy Frontend

Frontend do Gastrofy desenvolvido em React + TypeScript + Tailwind CSS.

O Gastrofy é um microSaaS para confeiteiros gerenciarem insumos, receitas, produtos, pedidos e clientes, com cálculo automático de custo e lucro. Este repositório contém a interface web que consome a [API do Gastrofy](https://github.com/savio018/gastrofy-API).

**Site em produção:** `https://gastrofy-front-end.vercel.app`

## Tecnologias

- React 19
- TypeScript
- Tailwind CSS
- Vite
- Axios
- React Router DOM
- Heroicons

## Status atual

- ✅ Autenticação completa: cadastro, login, verificação de email, reenvio de verificação
- ✅ Layout autenticado: sidebar de navegação, painel de alertas em tempo real
- ✅ Módulo de **Insumos**: listagem em cards, criação, edição, exclusão, reposição de estoque, com destaque visual para insumos em alerta (estoque baixo/crítico ou validade próxima)
- 🔜 Módulos de Receitas, Produtos, Pedidos e Clientes (em desenvolvimento)
- 🔜 Dashboard com dados reais
- 🔜 Tema claro/escuro

## Como rodar localmente

1. Clone o repositório
2. `npm install`
3. Crie um arquivo `.env` na raiz com base no `.env.example`:
   ```
   VITE_API_URL=http://localhost:8080
   ```
4. `npm run dev`

> ⚠️ Para rodar localmente, o backend precisa estar rodando na URL configurada em `VITE_API_URL` (por padrão, `http://localhost:8080`). Veja o repositório da [API](https://github.com/savio018/gastrofy-API) para instruções de como subir o backend.

## Deploy

O projeto está hospedado no **Vercel**, com a variável de ambiente `VITE_API_URL` apontando para a API em produção no Railway. O arquivo `vercel.json` garante o funcionamento correto do roteamento client-side (React Router) em produção.  