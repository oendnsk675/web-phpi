# Dokumentasi Handover Web PHPI

Dokumentasi ini dibuat untuk developer internal yang akan melanjutkan pengembangan dan operasional aplikasi Web PHPI.

## Daftar Dokumen

- [Overview aplikasi](./01-overview.md)
- [Setup lokal](./02-setup-local.md)
- [Environment variable](./03-environment.md)
- [Database dan migration](./04-database.md)
- [Routing dan fitur](./05-routing-and-features.md)
- [Auth, upload, dan asset](./06-auth-uploads-assets.md)
- [Operasional](./07-operations.md)
- [Maintenance](./08-maintenance.md)
- [Checklist handover](./09-handover-checklist.md)
- [Deployment](./10-deployment.md)

## Ringkasan Stack

- Runtime: Node.js dengan CommonJS modules.
- Server: Express 4.
- View engine: EJS dengan `express-ejs-layouts`.
- Database: PostgreSQL menggunakan TypeORM `DataSource`.
- Asset: file statis dari `public/` dan upload dari `uploads/`.
- Styling: Sass dari `public/assets/sass/style.scss` ke `public/assets/sass/style.css`.

## Entry Point Penting

- Aplikasi: `src/server.js`
- Route aggregator: `src/routes.js`
- Konfigurasi database: `src/configs/ormconfig.js`
- Route halaman/admin/API: `src/routes/`
- Controller: `src/controller/`
- Entity TypeORM: `src/models/`
- Migration TypeORM: `src/migrations/`
- View EJS: `src/views/`
- Static asset: `public/`
- Upload file: `uploads/`
