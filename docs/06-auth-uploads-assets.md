# Auth, Upload, Dan Asset

Dokumen ini merangkum middleware auth, authorization, upload file, image processing, dan asset statis.

## Auth

Middleware auth berada di `src/middlewares/auth.js`.

Perilaku utama:

- Mengecek `req.session.user`.
- Jika user tidak ada, request diarahkan ke `/login`.
- Jika user ada, request dilanjutkan ke handler berikutnya.

## Authorization

Middleware authorization berada di `src/middlewares/authorization.js`.

Perilaku utama:

- Mengecek role user.
- Role yang diizinkan adalah `admin`.
- Jika tidak authorized, aplikasi merender `pages/errors/unauthorized`.

## Upload File

Konfigurasi upload berada di `src/configs/multer.js`.

Aturan upload:

- MIME yang diizinkan: `image/jpeg`, `image/png`, `image/webp`.
- Extension yang diizinkan: `.jpg`, `.jpeg`, `.png`, `.webp`.
- Limit ukuran file: `1 MB`.
- Default folder upload: `uploads/photos`.
- Folder upload blog: `uploads/blog`.

## Image Processing

Middleware pemrosesan gambar berada di `src/middlewares/image.js`.

Perilaku utama:

- Memproses gambar upload dengan `sharp`.
- Resize gambar menjadi `300x300`.
- Convert output menjadi PNG.

## Static Asset

Asset publik dilayani dari folder `public/`.

Upload file dilayani dari folder `uploads/`.

Sass utama berada di:

```text
public/assets/sass/style.scss
```

Output CSS berada di:

```text
public/assets/sass/style.css
```

Jalankan watch Sass saat mengubah style:

```bash
pnpm styles:watch
```

## Catatan Keamanan

- Jangan longgarkan validasi MIME dan extension tanpa kebutuhan jelas.
- Jangan menaikkan limit upload tanpa mempertimbangkan storage dan performa.
- Jangan menyimpan file privat di folder yang dilayani sebagai static asset.
- Pastikan route upload admin tetap dilindungi auth yang sesuai.
