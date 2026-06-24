# Checklist Handover

Gunakan checklist ini saat menyerahkan project ke developer atau tim berikutnya.

## Akses Dan Environment

- Repository sudah bisa diakses oleh developer penerima.
- File `.env.example` tersedia dan sesuai kebutuhan aplikasi.
- Nilai `.env` development sudah dibagikan lewat kanal aman, bukan commit repository.
- Akses database development atau staging sudah tersedia.
- Folder upload yang dibutuhkan tersedia di environment target.

## Setup Lokal

- Developer penerima sudah menjalankan `pnpm install`.
- PostgreSQL lokal atau Docker sudah berjalan.
- Migration sudah dijalankan jika database baru.
- Seeder sudah dijalankan jika membutuhkan data awal.
- Aplikasi bisa dijalankan dengan `pnpm dev`.

## Verifikasi Fitur

- Halaman home bisa dibuka.
- Halaman product/service bisa dibuka.
- Halaman post/blog bisa dibuka.
- Login dan logout berjalan.
- Panel admin bisa diakses oleh user yang sesuai.
- Upload gambar pada fitur terkait berjalan.
- API yang dibutuhkan frontend berjalan.

## Database

- Entity dan migration terakhir sudah sinkron.
- `synchronize` tetap `false`.
- Backup atau dump data hanya dibagikan lewat kanal aman jika dibutuhkan.
- Credential database tidak tersimpan di repository.

## Operasional

- Command development sudah diketahui.
- Target Makefile yang relevan sudah diketahui.
- Konfigurasi PM2 di `ecosystem.config.js` sudah diketahui jika dipakai di server.
- Proses compile/watch Sass sudah diketahui.

## Risiko Dan Catatan

- Project belum memiliki script test, lint, type-check, atau build khusus.
- Script migration di `package.json` perlu dicek karena memanggil `npm run typeorm`, sementara script `typeorm` belum tersedia.
- Perubahan schema harus selalu disertai migration.
- Upload file perlu dijaga agar tidak menerima file selain format gambar yang diizinkan.
