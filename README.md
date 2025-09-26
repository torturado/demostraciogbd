# Ñam Ñam · Demo GBD

Aplicación web construida con **Next.js 15**, **TypeScript**, **Tailwind CSS 4** y **Prisma** para demostrar la inserción y consulta de datos sobre la base de datos del restaurant Ñam Ñam. La interfaz incluye formularios validados con React Hook Form, un panel de consultas predefinidas y un dashboard que lista todas las tablas del sistema.

## Características principales

- **UI moderna** con paleta cálida (stone + burdeos) y componentes reutilizables (`card`, `button-primary`).
- **Formularios completos** para categorías, clientes, productos, reservas y pedidos con detalle; el pedido calcula subtotales y total automáticamente a partir del catálogo.
- **Panel de consultas** (`/queries`) con ocho SELECTs preparadas que cubren todas las tablas (join, agregaciones, conteos y LEFT JOINs).
- **Dashboard de datos** (`/datos`) que presenta las tablas en tiempo real usando Prisma + `QueryResultTable`.
- **API REST** propia (`/api/insert-*`, `/api/products`, `/api/queries`) con Prisma Client y gestión de errores.
- **Soporte MySQL** con definición de esquema en `prisma/schema.prisma` y scripts `npm run prisma:*`.

## Estructura de carpetas

```text
app/
  page.tsx                 Página de inicio con accesos rápidos
  insert/page.tsx          Formularios de inserción
  queries/page.tsx         Panel de consultas SELECT
  info/page.tsx            Documentación del proyecto
  datos/page.tsx           Visualización de tablas
components/
  Insert*Form.tsx          Formularios (clientes, productos, reservas, pedidos, categorías)
  QueryResultTable.tsx     Tabla reutilizable para resultados
lib/
  prisma.ts                Cliente Prisma con singleton
  serialization.ts         Serializador seguro para $queryRaw
pages/api/
  insert-*.ts              Endpoints POST de inserción
  queries.ts               SELECTs predefinidas
  products.ts              Catálogo de productos para la UI
prisma/
  schema.prisma            Definición del modelo MySQL
public/
  ...                      Recursos estáticos
```

## Requisitos

- Node.js 18+ (recomendado 20)
- npm 10+
- Docker (opcional, para levantar MySQL con `docker-compose.yml`)

## Puesta en marcha

1. **Clonar e instalar dependencias**
   ```bash
   git clone <tu-fork-o-repo>
   cd demonstraciongbd
   npm install
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Edita .env con tu cadena MySQL y, si usas migraciones, SHADOW_DATABASE_URL
   ```

3. **Levantar MySQL (opcional)**
   ```bash
   docker compose up -d
   ```

4. **Generar Prisma Client y migrar**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Iniciar la aplicación**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) para ver la demo.

## Scripts disponibles

- `npm run dev` – Desarrollo con Turbopack.
- `npm run build` / `npm run start` – Compilar e iniciar producción.
- `npm run lint` – Eslint con la configuración de Next.js.
- `npm run prisma:generate` – Genera Prisma Client.
- `npm run prisma:migrate` – Ejecuta migraciones (requiere MySQL accesible).
- `npm run prisma:studio` – Abre Prisma Studio en el navegador.

## Endpoints importantes

| Método | Ruta                  | Descripción                                                  |
|--------|-----------------------|--------------------------------------------------------------|
| POST   | `/api/insert-categoria` | Alta de categorías.                                           |
| POST   | `/api/insert-client`    | Alta de clientes.                                             |
| POST   | `/api/insert-product`   | Alta de productos (usa ID de categoría).                      |
| POST   | `/api/insert-reserva`   | Alta de reservas.                                             |
| POST   | `/api/insert-pedido`    | Alta de pedidos con detalle; calcula total y subtotales.     |
| GET    | `/api/queries?type=...` | SELECTs predefinidas (clientes, productos, reservas, pedidos).|
| GET    | `/api/products`         | Catálogo de productos para autocompletar formularios.        |

## Tailwind & diseño

- Utiliza la versión 4 de Tailwind (a través de `@tailwindcss/postcss`).
- Colores base definidos en `app/globals.css` usando variables CSS:
  - Fondo `#1c1917` (stone-900)
  - Texto `#f5f5f4` (stone-100)
  - Acentos `#b91c1c` / `#dc2626` (red-700/red-600)
- Componentes `.card` y `.button-primary` centralizan estilo.

## Créditos

- Cas Pràctic 1 · Sergi Lucas · Derek Sanz · Soufiane Zemmah
- Menció honorífica a **ChatGPT Codex** pel suport en el desenvolupament.

---

Si encuentras un bug o quieres proponer mejoras, abre un issue o envía un PR en GitHub. ¡Gràcies! 🙌
