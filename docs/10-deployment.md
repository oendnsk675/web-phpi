# Deployment

Dokumen ini berisi panduan deployment aplikasi Web PHPI ke server dengan PostgreSQL, PM2, dan Nginx.

Konfigurasi Nginx sengaja tidak dirinci karena akan diisi sesuai setup server yang digunakan.

## Prasyarat Server

- Node.js dan pnpm sudah terpasang.
- PostgreSQL sudah terpasang dan berjalan.
- PM2 sudah terpasang secara global.
- Nginx sudah terpasang dan siap dikonfigurasi.
- Repository aplikasi sudah tersedia di server.
- File `.env` production sudah dibuat dari `.env.example`.

## Struktur Umum Deployment

Alur deployment yang disarankan:

1. Pull source code terbaru dari repository.
2. Install dependency dengan `pnpm install`.
3. Siapkan file `.env` production.
4. Pastikan database PostgreSQL dan user database tersedia.
5. Jalankan migration TypeORM.
6. Jalankan atau restart aplikasi dengan PM2.
7. Arahkan Nginx ke port aplikasi.
8. Verifikasi halaman dan log aplikasi.

## Environment Production

Buat file `.env` di root project pada server.

Gunakan `.env.example` sebagai template, lalu sesuaikan nilainya:

```env
PORT=3000
APP_URL=https://domain-production.example

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=isi_user_database
POSTGRES_PASSWORD=isi_password_database
POSTGRES_DATABASE=isi_nama_database
POSTGRES_CONTAINER_NAME=
```

Catatan:

- Jangan commit file `.env`.
- Gunakan password database yang kuat.
- Pastikan `APP_URL` memakai domain production.
- `POSTGRES_CONTAINER_NAME` hanya diperlukan jika memakai helper Docker lokal dari Makefile.

## PostgreSQL

Pastikan database dan user sudah tersedia di server.

Checklist PostgreSQL:

- Service PostgreSQL berjalan.
- Database production sudah dibuat.
- User database memiliki akses ke database aplikasi.
- Firewall hanya membuka akses database sesuai kebutuhan.
- Backup database sudah disiapkan jika aplikasi menyimpan data penting.

## Install Dependency

Jalankan dari root project:

```bash
pnpm install
```

Jika server memakai mode production dan dependency dev tetap dibutuhkan untuk command operasional tertentu, pastikan command tersebut masih bisa berjalan sebelum memakai opsi install production-only.

## Migration Database

Jalankan migration setelah `.env` production benar dan PostgreSQL bisa diakses.

```bash
npx typeorm migration:run -d ./src/configs/ormconfig.js
```

Rollback migration terakhir jika diperlukan:

```bash
npx typeorm migration:revert -d ./src/configs/ormconfig.js
```

Catatan:

- Project ini belum memiliki script `typeorm` di `package.json`, jadi gunakan TypeORM CLI langsung jika script migration package gagal.
- Jangan mengaktifkan `synchronize: true`.
- Jalankan migration dengan hati-hati di production dan pastikan backup tersedia untuk perubahan besar.

## PM2

Project sudah memiliki konfigurasi PM2 di `ecosystem.config.js`.

Start aplikasi pertama kali:

```bash
pm2 start ecosystem.config.js
```

Restart aplikasi setelah deploy berikutnya:

```bash
pm2 restart phpi
```

Melihat status aplikasi:

```bash
pm2 status
```

Melihat log aplikasi:

```bash
pm2 logs phpi
```

Menyimpan process list PM2 agar bisa restore setelah reboot:

```bash
pm2 save
```

Setup startup PM2 mengikuti output command berikut:

```bash
pm2 startup
```

## Nginx

Nginx digunakan sebagai reverse proxy ke port aplikasi Express.

Isi konfigurasi Nginx sesuai standar server yang digunakan.

Checklist Nginx:

- Server block memakai domain production.
- Reverse proxy diarahkan ke `http://127.0.0.1:<PORT>` sesuai nilai `PORT` di `.env`.
- Header proxy disesuaikan kebutuhan aplikasi.
- SSL/TLS dikonfigurasi jika memakai HTTPS.
- Upload body size disesuaikan dengan limit upload aplikasi jika diperlukan.

## Asset Dan Upload

Folder penting:

- `public/` untuk static asset.
- `uploads/` untuk file upload aplikasi.

Checklist asset dan upload:

- Folder `uploads/` tersedia di server.
- Permission folder upload mengizinkan user proses Node.js menulis file.
- Jangan hapus folder `uploads/` saat deploy.
- Jika memakai deployment berbasis release folder, pastikan `uploads/` dibuat sebagai shared directory.

## Sass Dan CSS

Output CSS yang digunakan aplikasi berada di:

```text
public/assets/sass/style.css
```

Jika mengubah Sass di server atau dalam proses deploy, compile CSS dari:

```text
public/assets/sass/style.scss
```

Command watch development:

```bash
pnpm styles:watch
```

Untuk production, sebaiknya CSS sudah dihasilkan sebelum aplikasi dijalankan.

## Verifikasi Setelah Deploy

Checklist verifikasi:

- `pm2 status` menunjukkan aplikasi `phpi` online.
- `pm2 logs phpi` tidak menunjukkan error startup.
- Halaman home bisa diakses dari domain production.
- Login dan logout berjalan jika fitur auth dipakai.
- Route admin bisa dibuka oleh user yang sesuai.
- Upload gambar berjalan jika fitur upload dipakai.
- API yang dibutuhkan frontend memberi response normal.
- Nginx access log dan error log tidak menunjukkan error berulang.

## Rollback Sederhana

Jika deploy bermasalah:

1. Kembalikan source code ke versi sebelumnya.
2. Jalankan `pnpm install` jika dependency berubah.
3. Revert migration jika perubahan database perlu dibatalkan.
4. Restart aplikasi dengan PM2.
5. Cek log aplikasi dan Nginx.

Command restart:

```bash
pm2 restart phpi
```

## Catatan Keamanan

- Jangan menyimpan `.env` di repository.
- Batasi akses SSH ke server.
- Batasi akses PostgreSQL dari luar server jika tidak diperlukan.
- Gunakan HTTPS untuk domain production.
- Pastikan backup database berjalan rutin.
- Jangan menaruh dump database atau file privat di folder static publik.
