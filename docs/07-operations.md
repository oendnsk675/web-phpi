# Operasional

Dokumen ini merangkum command dan konfigurasi operasional yang tersedia di project.

## Command Development

Install dependency:

```bash
pnpm install
```

Jalankan server development:

```bash
pnpm dev
```

Watch Sass:

```bash
pnpm styles:watch
```

Format JavaScript dan EJS:

```bash
pnpm format
```

Seed data awal:

```bash
pnpm seed
```

## Makefile

Project menyediakan beberapa target Makefile.

| Target | Fungsi |
| --- | --- |
| `make run` | Menjalankan `pnpm dev`. |
| `make styles` | Menjalankan `pnpm styles:watch`. |
| `make run-postgres` | Menjalankan container PostgreSQL 16.3. |
| `make stop-postgres` | Menghentikan container PostgreSQL. |
| `make spin-up` | Recreate PostgreSQL container dan menjalankan aplikasi. |

## PM2

Konfigurasi PM2 berada di `ecosystem.config.js`.

Nama aplikasi PM2:

```text
phpi
```

Entry point PM2:

```text
src/server.js
```

## Development Watcher

Konfigurasi nodemon berada di `nodemon.json`.

Server development dijalankan lewat:

```bash
pnpm dev
```

## Verifikasi Manual

Project belum menyediakan script test, lint, type-check, atau build khusus. Untuk perubahan server, verifikasi minimal yang disarankan:

- Jalankan PostgreSQL lokal atau Docker.
- Jalankan migration jika ada perubahan schema.
- Jalankan `pnpm dev`.
- Buka route yang terdampak di browser.
- Cek log server untuk error runtime.
- Jalankan `pnpm format` setelah mengubah file `.js` atau `.ejs`.
