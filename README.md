# Gestión Municipal de Solicitudes de Materiales

MVP web en español para centralizar solicitudes de materiales, respuestas de proveedores, facturas, remitos y entregas.

## Stack
- React + Vite + Tailwind CSS
- Node.js + Express
- PostgreSQL + Prisma
- JWT, subida local de archivos con abstracción extensible
- Docker Compose

## Usuarios demo
| Rol | Email | Contraseña |
| --- | --- | --- |
| Administrador | admin@demo.com | admin123 |
| Solicitante / Autorizante | solicitante@demo.com | demo123 |
| Proveedor | proveedor@demo.com | demo123 |

## Inicio rápido con Docker
```bash
cp .env.example .env
docker compose up --build
```
Luego inicializá la base:
```bash
docker compose exec server npx prisma migrate deploy
docker compose exec server npm run seed
```
Frontend: http://localhost:5173
API: http://localhost:4000/api

## Inicio local
```bash
cp .env.example .env
npm install
npm --prefix server install
npm --prefix client install
npm --prefix server run prisma:migrate
npm --prefix server run seed
npm run dev
```

## Funcionalidades
- Login con JWT y permisos por rol.
- Solicitantes crean y consultan sus solicitudes.
- Proveedores aceptan/rechazan, valorizan, cargan facturas/remitos y registran entregas.
- Administradores ven usuarios, proveedores, auditoría y gestionan estados.
- Historial de estados, filtros, notificaciones, estados vacíos, confirmaciones y previsualización de PDF/imagen.

## Estructura
- `server/prisma`: schema, migraciones y seed.
- `server/src/modules`: módulos REST por dominio.
- `client/src/pages`: pantallas principales.
- `client/src/components`: layout, timeline, modales y utilidades UI.
