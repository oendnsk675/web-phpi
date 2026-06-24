# Routing Dan Fitur

Route utama didaftarkan dari `src/routes.js`, lalu dipisah ke file route di `src/routes/` dan `src/routes/admin/`.

## Route Publik

| Area | File | Ringkasan |
| --- | --- | --- |
| Home | `src/routes/home.js` | Halaman utama aplikasi. |
| Product | `src/routes/product.js` | List, search, dan detail product/service. |
| Post | `src/routes/post.js` | List post/blog, detail post, dan komentar. |
| Directory | `src/routes/directory.js` | Halaman direktori. |
| Review | `src/routes/review.js` | Submit review, membutuhkan login. |

## Route Auth

Route auth didaftarkan melalui route aggregator utama. Middleware auth menggunakan session user dari `req.session.user`.

## Route Admin Dan Panel

Route admin berada di `src/routes/admin/` dan umumnya memakai middleware `checkAuth`.

Contoh area admin yang sudah diaudit:

- Location: CRUD lokasi dan upload thumbnail.
- Post: CRUD post, upload thumbnail, dan upload gambar blog.

## Route API

Route API berada di `src/routes/api/index.js`.

- `GET /provinces`
- `GET /regencies`
- `GET /user/by-ktp/:no_ktp`
- `GET /cdn/photo/:user_id`

## Pola Request

1. Request masuk ke Express di `src/server.js`.
2. Route aggregator di `src/routes.js` memilih route yang sesuai.
3. Route memanggil controller di `src/controller/`.
4. Controller membaca/menulis data lewat model TypeORM di `src/models/`.
5. Response dirender sebagai EJS atau dikirim sebagai JSON/file.

## Catatan Pengembangan Route

- Untuk route baru, update file route dan controller terkait bersama-sama.
- Untuk route admin, cek kebutuhan `checkAuth` dan `checkAuthorization`.
- Untuk route dengan upload, gunakan konfigurasi `multer` dan middleware image yang sudah ada.
- Untuk response halaman, ikuti layout dan komponen EJS di `src/views/`.
