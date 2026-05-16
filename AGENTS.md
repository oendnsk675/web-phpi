# CRITICAL RULES - MUST FOLLOW

## RESPONSES

- Keep responses concise and to the point unless the user asks otherwise.
- Use Indonesian when the user writes in Indonesian.
- Be explicit when a command cannot be run or when the project does not provide a matching script.

## PROJECT STACK

- Runtime: Node.js with CommonJS modules.
- Server: Express 4, `body-parser`, `express-session`, `connect-flash`, and `morgan`.
- Views: EJS with `express-ejs-layouts`.
- Database: PostgreSQL using TypeORM `DataSource`.
- Assets: static files from `public/`, uploaded files from `uploads/`, Sass compiled from `public/assets/sass/style.scss` to `public/assets/sass/style.css`.
- Formatting: Prettier with `prettier-plugin-ejs`.

## PROJECT STRUCTURE

- `src/server.js`: application entry point and Express setup.
- `src/routes.js` and `src/routes/**`: route registration.
- `src/controller/**`: request handlers.
- `src/models/**`: TypeORM entity schemas/models.
- `src/migrations/**`: TypeORM migrations.
- `src/configs/ormconfig.js`: PostgreSQL and TypeORM configuration.
- `src/views/**`: EJS layouts, pages, and components.
- `src/middlewares/**`: Express middleware.
- `src/seed/**`: seed scripts.
- `public/**`: static assets.
- `uploads/**`: user-uploaded/static upload files.

## PLANNING MODE

- Always ask clarifying questions before proposing broad feature work.
- Never assume design, database behavior, routes, or user flows when the codebase can be inspected.
- For substantial work, inspect the existing controllers, routes, models, and EJS views before presenting a plan.
- Use deep-dive sub-agents when available for parallel research or review of complex plans.
- Keep plans grounded in the current Express/EJS/TypeORM architecture.

## CHANGE / EDIT MODE

- Prefer small, focused edits that match the existing CommonJS and EJS style.
- Do not introduce TypeScript, Prisma, React, Next.js, Tailwind, or a new framework unless the user explicitly asks.
- For route changes, update the matching route file and controller together.
- For UI changes, reuse existing EJS layouts/components and styles in `public/assets/sass/style.scss` or nearby Sass files.
- For file uploads or image processing, preserve the current `multer`, `sharp`, and `uploads/` conventions.
- Use sub-agents when available for independent implementation or review tasks.
- After completing changes, run the strongest relevant checks available in this project.
- Do not make a commit or push unless the user explicitly asks for it.

## COMMANDS

- Install dependencies: `pnpm install`.
- Start development server: `pnpm dev`.
- Watch Sass: `pnpm styles:watch`.
- Format JavaScript and EJS: `pnpm format`.
- Seed initial data: `pnpm seed`.
- Run PostgreSQL with Docker using `.env`: `make run-postgres`.
- Start app through Makefile: `make run`.
- Recreate PostgreSQL container and start app: `make spin-up`.

## DATABASE SCHEMA CHANGES

- The project uses TypeORM migrations, not Prisma.
- Never enable `synchronize: true` in `src/configs/ormconfig.js`.
- When changing `src/models/**`, create or update a migration in `src/migrations/**`.
- Run migrations against `src/configs/ormconfig.js`.
- The current `package.json` migration scripts call `npm run typeorm`, but no `typeorm` script is defined. If migration scripts fail, either add the missing script intentionally or use the TypeORM CLI directly, for example:
  - `npx typeorm migration:create src/migrations/MigrationName`
  - `npx typeorm migration:generate ./src/migrations/MigrationName -d ./src/configs/ormconfig.js`
  - `npx typeorm migration:run -d ./src/configs/ormconfig.js`
  - `npx typeorm migration:revert -d ./src/configs/ormconfig.js`
- Confirm PostgreSQL is running and `.env` is configured before running migrations or seeders.

## TESTING AND VERIFICATION

- This project currently has no dedicated test, lint, type-check, or build script.
- Always run `pnpm format` after editing `.js` or `.ejs` files.
- For server changes, run or start `pnpm dev` when feasible and verify the affected route manually.
- For Sass changes, run `pnpm styles:watch` or compile Sass to confirm CSS generation.
- For database changes, verify migrations and seeders with a real PostgreSQL connection when feasible.
- If no relevant automated check exists, state that clearly and describe the manual verification performed.

## UI DESIGN

- Follow the existing EJS layout/component structure in `src/views/layouts`, `src/views/components`, and `src/views/pages`.
- Keep public pages consistent with the current site style and dashboard pages consistent with the panel layout.
- Avoid adding visible instructional text unless it is part of the requested product copy.
- Reuse existing assets and classes before creating new patterns.
- Ensure EJS changes render correctly with `express-ejs-layouts`.
- Always follow the UI design system when creating or reviewing components or pages.
- Design System: @DESIGN.md

## SECURITY AND DATA HANDLING

- Do not commit `.env`, credentials, database dumps, or private upload data.
- Keep session, flash, auth, and authorization behavior consistent with existing middlewares.
- Validate and sanitize user input in controllers before database writes.
- Be careful with uploaded files; preserve existing `multer` and image middleware constraints.
- Avoid logging sensitive user data.

## GIT WORKFLOW

- Check `git status` before editing when the task may touch existing files.
- Never revert user changes unless explicitly requested.
- Keep commits focused and use the repository's requested commit format if one is provided.
- Only stage, commit, or push after the user explicitly asks.
