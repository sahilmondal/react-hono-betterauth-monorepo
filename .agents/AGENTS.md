# Workspace Rules & Conventions

## File Naming Conventions

- Component filenames: **kebab-case** (e.g. `login-form.tsx`, `signup-form.tsx`)
- Component export functions: **PascalCase** (e.g. `export function LoginForm() {}`)
- Routing filenames: **kebab-case** (e.g. `forgot-password.tsx`, `reset-password.tsx`)
- Database schemas: **kebab-case.schema.ts** (e.g. `auth.schema.ts`)
- Configs & utilities: **kebab-case.ts** (e.g. `auth-client.ts`)

## Architecture Rules

- Use shared database package `@workspace/db` for backend services (Hono API, etc.).
- Avoid direct database connection initializations inside backend services; import `db` from `@workspace/db` instead.
- React App is a pure client-side SPA; it must not import `@workspace/db` or directly connect to the database.
