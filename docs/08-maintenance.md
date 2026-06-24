# Maintenance

Dokumen ini berisi panduan maintenance untuk perubahan yang umum dilakukan di aplikasi.

## Menambah Route Atau Fitur

- Cari area route yang sesuai di `src/routes/` atau `src/routes/admin/`.
- Tambahkan handler di controller terkait di `src/controller/`.
- Gunakan entity yang sudah ada dari `src/models/` jika memungkinkan.
- Tambahkan atau update view di `src/views/` jika response berupa halaman.
- Lindungi route admin dengan middleware auth yang sesuai.

## Mengubah Database Schema

- Update entity di `src/models/`.
- Buat migration di `src/migrations/`.
- Pastikan migration diregistrasikan di `src/configs/ormconfig.js` jika masih memakai import manual.
- Jalankan migration di database lokal.
- Jangan memakai `synchronize: true`.

## Mengubah Tampilan

- Gunakan layout dan komponen EJS yang sudah ada.
- Untuk halaman publik, pertahankan gaya visual website yang ada.
- Untuk panel, pertahankan pola layout dashboard/panel.
- Ubah Sass dari `public/assets/sass/style.scss` atau file Sass terkait.
- Jalankan `pnpm styles:watch` untuk menghasilkan CSS.

## Mengubah Upload Gambar

- Gunakan konfigurasi `multer` di `src/configs/multer.js`.
- Gunakan middleware image di `src/middlewares/image.js` jika gambar perlu diproses.
- Pertahankan validasi MIME, extension, dan limit file.
- Pastikan folder upload tidak menyimpan credential atau file privat.

## Mengubah Auth Dan Authorization

- Auth session memakai `req.session.user`.
- Middleware `checkAuth` mengarahkan user tidak login ke `/login`.
- Middleware `checkAuthorization` saat ini mengizinkan role `admin`.
- Perubahan role harus dicek terhadap semua route admin yang terdampak.

## Checklist Sebelum Handover Perubahan

- `pnpm format` sudah dijalankan untuk perubahan `.js` dan `.ejs`.
- Migration sudah dibuat untuk perubahan schema.
- Route yang terdampak sudah dicoba secara manual.
- Tidak ada `.env`, credential, dump database, atau private upload yang ikut commit.
- Dokumentasi terkait sudah diperbarui jika ada perubahan setup atau flow penting.
