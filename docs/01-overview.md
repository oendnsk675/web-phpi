# Overview Aplikasi

Web PHPI adalah aplikasi web berbasis Express dan EJS untuk mengelola halaman publik, konten, produk/layanan, lokasi, review, direktori, dan panel admin.

## Stack Utama

- Node.js dengan CommonJS modules.
- Express 4 sebagai HTTP server.
- EJS sebagai template engine.
- `express-ejs-layouts` untuk layout view.
- PostgreSQL sebagai database.
- TypeORM `DataSource` untuk entity, migration, dan koneksi database.
- `express-session` untuk session user.
- `connect-flash` untuk flash message.
- `multer` dan `sharp` untuk upload dan pemrosesan gambar.
- Sass untuk stylesheet utama.

## Alur Aplikasi

1. `src/server.js` memuat konfigurasi environment, middleware, session, static asset, layout EJS, dan route utama.
2. `src/configs/ormconfig.js` membuat koneksi TypeORM ke PostgreSQL.
3. `src/routes.js` mendaftarkan route publik, route API, auth, dan panel admin.
4. Route di `src/routes/` meneruskan request ke controller di `src/controller/`.
5. Controller menggunakan model/entity di `src/models/` untuk membaca atau menulis data.
6. View EJS di `src/views/` merender halaman publik dan panel.

## Area Fitur

- Halaman publik: home, product/service, post/blog, directory, dan review.
- Auth: login/logout dan session user.
- Panel admin: pengelolaan data konten dan master data.
- API: data wilayah, lookup user, dan akses foto.
- Upload: thumbnail lokasi, thumbnail post, gambar blog, dan foto user.

## Catatan Penting

- Project belum menyediakan script test, lint, type-check, atau build khusus.
- Format JavaScript dan EJS dilakukan lewat `pnpm format`.
- Migration TypeORM harus dijalankan dengan koneksi PostgreSQL yang valid.
- Jangan mengaktifkan `synchronize: true` di konfigurasi TypeORM pada production environment.
