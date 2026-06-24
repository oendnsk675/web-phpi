# Web PHPI

Repository ini berisi aplikasi Web PHPI berbasis Express, EJS, PostgreSQL, dan TypeORM.

## Dokumentasi Developer

Dokumentasi handover dan panduan developer tersedia di:

- [Dokumentasi handover](./docs/README.md)
- [Setup lokal](./docs/02-setup-local.md)
- [Environment variable](./docs/03-environment.md)
- [Database dan migration](./docs/04-database.md)
- [Routing dan fitur](./docs/05-routing-and-features.md)
- [Operasional](./docs/07-operations.md)
- [Deployment](./docs/10-deployment.md)

## Quick Start

```bash
pnpm install
```

Salin `.env.example` menjadi `.env`, lalu sesuaikan konfigurasi database.

Jalankan PostgreSQL lokal dengan Docker jika diperlukan:

```bash
make run-postgres
```

Jalankan aplikasi:

```bash
pnpm dev
```

Jalankan watch Sass jika mengubah style:

```bash
pnpm styles:watch
```

## Command Penting

- `pnpm dev`: menjalankan server development.
- `pnpm styles:watch`: compile Sass secara watch.
- `pnpm format`: format file `.js` dan `.ejs`.
- `pnpm seed`: menjalankan seed data awal.
- `make run-postgres`: menjalankan PostgreSQL Docker lokal.
- `make spin-up`: recreate PostgreSQL container dan menjalankan aplikasi.

## Catatan

- Project belum menyediakan script test, lint, type-check, atau build khusus.
- Database schema dikelola dengan TypeORM migration.
- Jangan mengaktifkan `synchronize: true` di konfigurasi TypeORM.
- Jangan commit `.env`, credential, dump database, atau upload privat.
