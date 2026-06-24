# Setup Lokal

Dokumen ini menjelaskan langkah setup aplikasi di mesin developer.

## Prasyarat

- Node.js dan pnpm.
- PostgreSQL lokal atau Docker.
- File `.env` yang dibuat dari `.env.example`.
- Akses ke source code dan dependency project.

## Instalasi Dependency

```bash
pnpm install
```

## Environment

1. Salin `.env.example` menjadi `.env`.
2. Isi konfigurasi database PostgreSQL.
3. Pastikan `APP_URL` sesuai alamat aplikasi lokal.

Contoh nilai umum untuk development:

```env
PORT=3000
APP_URL=http://localhost:3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=web_phpi
POSTGRES_CONTAINER_NAME=web-phpi-postgres
```

## Menjalankan PostgreSQL Dengan Docker

Project menyediakan helper di `Makefile`.

```bash
make run-postgres
```

Target ini menjalankan PostgreSQL 16.3 dengan konfigurasi dari `.env`.

## Menjalankan Aplikasi

```bash
pnpm dev
```

Alternatif lewat Makefile:

```bash
make run
```

## Menjalankan Watch Sass

```bash
pnpm styles:watch
```

Alternatif lewat Makefile:

```bash
make styles
```

## Seed Data Awal

```bash
pnpm seed
```

Seeder menjalankan user, language, category, dan location seeder secara berurutan.

## Format Kode

```bash
pnpm format
```

Perintah ini memformat file `.js` dan `.ejs` menggunakan Prettier dengan `prettier-plugin-ejs`.
