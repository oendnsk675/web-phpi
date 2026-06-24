# Database Dan Migration

Project menggunakan PostgreSQL dan TypeORM `DataSource`.

## Konfigurasi

Konfigurasi database berada di `src/configs/ormconfig.js`.

File ini mengatur:

- Tipe database PostgreSQL.
- Host, port, username, password, dan database dari environment variable.
- Entity dari `src/models/`.
- Migration dari `src/migrations/`.
- `synchronize: false`.

Jangan mengubah `synchronize` menjadi `true`, terutama untuk environment yang menyimpan data production.

## Entity Utama

Entity TypeORM berada di `src/models/`.

- `User`
- `Language`
- `UserAvailableAreas`
- `SpecialInterest`
- `Review`
- `ProductServices`
- `Itinerary`
- `Product`
- `Category`
- `ProductLocation`
- `Banner`
- `Post`
- `Tag`
- `Comment`

## Migration Yang Terdaftar

Migration berada di `src/migrations/` dan diregistrasikan di `src/configs/ormconfig.js`.

- `AddNoKTPandNIPatUserTable1753880113435`
- `AddColumnsProvinceCodeAndKabKotaCodeAtUserTable1753881394840`

## Membuat Migration Baru

Package scripts migration saat ini memanggil `npm run typeorm`, tetapi script `typeorm` belum tersedia di `package.json`. Jika script migration gagal, gunakan TypeORM CLI langsung.

Membuat file migration kosong:

```bash
npx typeorm migration:create src/migrations/NamaMigration
```

Generate migration dari perubahan entity:

```bash
npx typeorm migration:generate ./src/migrations/NamaMigration -d ./src/configs/ormconfig.js
```

Menjalankan migration:

```bash
npx typeorm migration:run -d ./src/configs/ormconfig.js
```

Rollback migration terakhir:

```bash
npx typeorm migration:revert -d ./src/configs/ormconfig.js
```

## Seeder

Seeder berada di `src/seed/`.

Jalankan seed data awal dengan:

```bash
pnpm seed
```

Perintah ini menjalankan seeder berikut secara berurutan:

- `src/seed/user.seeder.js`
- `src/seed/language.seeder.js`
- `src/seed/category.seeder.js`
- `src/seed/location.seeder.js`

## Checklist Perubahan Schema

- Update entity di `src/models/`.
- Buat migration di `src/migrations/`.
- Register migration di `src/configs/ormconfig.js`.
- Jalankan migration ke database lokal.
- Jalankan flow aplikasi yang terdampak.
