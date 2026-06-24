# Environment Variable

Project membaca konfigurasi dari environment variable melalui `dotenv`.

## Variable Aplikasi

| Variable | Wajib | Default | Keterangan |
| --- | --- | --- | --- |
| `PORT` | Tidak | `3000` | Port HTTP server Express. |
| `APP_URL` | Ya | - | Base URL aplikasi, digunakan untuk kebutuhan URL aplikasi. |

## Variable Database

| Variable | Wajib | Default | Keterangan |
| --- | --- | --- | --- |
| `POSTGRES_HOST` | Ya | - | Host PostgreSQL. |
| `POSTGRES_PORT` | Tidak | `5433` | Port PostgreSQL yang dipakai TypeORM jika env kosong. |
| `POSTGRES_USER` | Ya | - | Username PostgreSQL. |
| `POSTGRES_PASSWORD` | Ya | - | Password PostgreSQL. |
| `POSTGRES_DATABASE` | Ya | - | Nama database PostgreSQL. |

## Variable Docker Lokal

| Variable | Wajib | Default | Keterangan |
| --- | --- | --- | --- |
| `POSTGRES_CONTAINER_NAME` | Tidak | - | Nama container yang digunakan target `make run-postgres` dan `make stop-postgres`. |

## File `.env.example`

Gunakan `.env.example` sebagai template. Jangan commit file `.env` karena berisi konfigurasi lokal dan credential.

## Catatan Keamanan

- Jangan menaruh credential production di dokumentasi.
- Jangan commit `.env`, dump database, atau file upload privat.
- Pastikan environment production memakai password database yang kuat dan berbeda dari development.
