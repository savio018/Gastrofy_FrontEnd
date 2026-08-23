# Gastrofy Frontend - Project State

**Última Atualização:** 2026-08-22  
**Tokens Gastos:** ~190k de 200k no Claude Code anterior

## 📊 Status Geral

- **Backend:** ✅ 100% Pronto (Spring Boot 4.0.3, Java 21)
- **Frontend:** ✅ Estrutura pronta, 🔄 Módulos em placeholder
- **GitHub:** ✅ Sincronizado (commit `3f9708b`)
- **Dev Server:** ✅ Funcional (`npm run dev` em `localhost:5173`)

## 🏗️ O que foi Implementado

### Estrutura Base
- React 19 + TypeScript + Vite
- Tailwind CSS 4 com dark mode
- React Router com 11 rotas (4 públicas, 7 privadas)
- Axios com interceptors JWT

### Autenticação
- ✅ Login com validação de email/senha
- ✅ Cadastro com validação de força de senha (8 chars, maiúscula, minúscula, número)
- ✅ Confirm password field
- ✅ Reset de senha
- ✅ Confirmação por email
- ✅ Error handling por campo

### Layout Principal
- ✅ Sidebar com menu navegável (240px, #3D1A1A)
- ✅ Topbar com sino de alertas
- ✅ Alertas de estoque (SEM_ESTOQUE, ESTOQUE_CRITICO, ESTOQUE_BAIXO, VENCIDO, VALIDADE_PROXIMA)
- ✅ Avatar + dropdown (Editar perfil, Tema, Sair)
- ✅ Dark mode toggle persistido
- ✅ Inter font + design tokens

### Configurações
- ✅ `.env` e `.env.example` (VITE_API_URL)
- ✅ `vercel.json` para SPA routing
- ✅ `.gitignore` com `.env*`
- ✅ `.claude/launch.json` para npm run dev

### Páginas Implementadas
- ✅ Login (`/login`) - Completa
- ✅ Cadastro (`/cadastro`) - Completa com validações
- ✅ Esqueci Senha (`/esqueci-senha`) - Completa
- ✅ Redefinir Senha (`/redefinir-senha`) - Completa
- ✅ Perfil (`/perfil`) - Leitura básica

### Páginas Placeholder
- 🔄 Dashboard (`/dashboard`)
- 🔄 Insumos (`/insumos`)
- 🔄 Receitas (`/receitas`)
- 🔄 Produtos (`/produtos`)
- 🔄 Pedidos (`/pedidos`)
- 🔄 Clientes (`/clientes`)

## 🔧 Como Continuar

### 1. Testar Login/Cadastro
```bash
# Terminal 1: Backend
cd C:\Users\Savio\OneDrive\Documentos\GitHub\gastrofy-API
java -jar target/gastrofy-api-*.jar

# Terminal 2: Frontend
cd C:\Users\Savio\OneDrive\Documentos\GitHub\gastrofy-frontend
npm run dev
```

Abrir `http://localhost:5173` e testar:
- Criar conta
- Verificar email
- Login
- Logout

### 2. Implementar Módulos

Cada módulo segue o padrão:

```
/pages/[Modulo].tsx
├── Consumir GET /[modulo] via axios
├── Mostrar lista em tabela/cards
├── Implementar CRUD (Create, Read, Update, Delete)
└── Usar padrão de erro + loading do projeto
```

**Endpoints do Backend:**
- `GET /insumos` - Listar insumos
- `POST /insumos` - Criar insumo
- `PUT /insumos/{id}` - Atualizar
- `DELETE /insumos/{id}` - Deletar
- (Similar para receitas, produtos, pedidos, clientes)

### 3. Design System

**Cores:**
- Sidebar: `#3D1A1A`
- Background: `#F5F0EB`
- Card: `#FFFFFF`
- Primary: `#3D1A1A`
- Danger: `#CC0000`
- Success: `#22C55E`
- Text: `#1A1A1A`
- Text Muted: `#6B6B6B`
- Border: `#E5E0DA`

**Componentes Disponíveis:**
- `<ForkIcon />` - Logo (customizado SVG)
- `<PaginaEmConstrucao titulo="" descricao="" />` - Placeholder

**Ícones:**
- Usar `@heroicons/react/24/outline`
- HomeIcon, ArchiveBoxIcon, BookOpenIcon, CakeIcon, ClipboardDocumentListIcon, UsersIcon, etc.

## 📁 Estrutura do Projeto

```
gastrofy-frontend/
├── .env                    (Local, não tracked)
├── .env.example            (Template)
├── vercel.json            (SPA routing)
├── src/
│   ├── context/           (AuthContext, ThemeContext)
│   ├── layout/            (Sidebar, Topbar, AuthenticatedLayout)
│   ├── pages/
│   │   ├── auth/          (Login, Cadastro, Forgot, Reset)
│   │   └── [Modulos].tsx  (Dashboard, Insumos, Receitas, etc)
│   ├── components/        (ForkIcon, PaginaEmConstrucao)
│   ├── lib/               (api.ts com Axios + interceptors)
│   ├── types/             (Usuario, Alerta types)
│   ├── routes/            (PrivateRoute.tsx)
│   ├── App.tsx            (Router config)
│   ├── main.tsx           (Providers setup)
│   └── index.css          (Design tokens + Tailwind)
└── node_modules/

```

## 🚀 Próximas Tarefas (Ordenadas)

1. **Testar fluxo de autenticação** com backend real
   - Criar conta
   - Verificar email
   - Login
   - Logout
   
2. **Implementar Dashboard**
   - Cards de resumo (pedidos hoje, estoque crítico, etc)
   - Consumir GET /alertas
   
3. **Implementar Insumos**
   - Tabela com listagem (GET /insumos)
   - Form de criar/editar (POST/PUT)
   - Delete com confirmação
   
4. **Implementar Produtos**
   - Similar ao Insumos
   - GET /produtos
   - POST/PUT/DELETE /produtos
   
5. **Implementar Receitas**
   - Listagem de receitas
   - Form de criar receita
   - Link receita → insumos
   
6. **Implementar Pedidos**
   - Tabela com status
   - Filtros por status
   - Marcar como pronto/entregue
   
7. **Implementar Clientes**
   - Listagem de clientes
   - Histórico de pedidos por cliente
   - Form de criar cliente
   
8. **Melhorias Gerais**
   - Testes E2E com Cypress/Playwright
   - Deploy no Vercel
   - Setup de CI/CD (GitHub Actions)

## 🔑 Commits Recentes

- `3f9708b` - Add Vercel configuration for SPA routing
- `69d7ee4` - Configure API URL via environment variables
- `9adf066` - Merge branch (GitHub sync)
- `f40a8be` - Improve signup form with field-level validation and error handling

## 📞 Como Usar Esse Documento

**Para próximo chat com Claude:**
1. Copie este conteúdo
2. Cole em um novo chat
3. Diga: "Continue com a tarefa X" ou "Implemente o módulo Y"

**Para novo Claude Code:**
1. Abra novo Claude Code
2. Dê acesso à pasta do frontend
3. Peça: "Leia o PROJECT_STATE.md e continue de onde paramos"

## ⚠️ Cuidados

- `.env` não está no Git (segurança)
- Backend roda em `localhost:8080` (mudar em `.env` se necessário)
- Vercel precisa de `vercel.json` para SPA (já configurado)
- Dark mode persiste em localStorage
- JWT token também persiste

---

**Estado:** Pronto para continuar  
**Tempo Estimado (próximas tarefas):** 3-4 horas pra módulos básicos
