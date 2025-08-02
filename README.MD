# 📘 Dokumentasi TypeORM

## 🏦 Migration

### 🔧 Setup Awal

Pastikan kamu telah mengatur `DataSource` di file `ormconfig.js` seperti berikut:

```js
// ormconfig.js
require('dotenv').config();
const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false, // penting: harus false untuk production
  logging: false,
  entities: [
    require('./models/User'),
    require('./models/Product'),
    // Tambahkan semua entitas lainnya di sini
  ],
  migrations: [__dirname + '/migrations/*.js'],
  subscribers: [],
});

module.exports = AppDataSource;
```

---

### 🛠️ Membuat Migration Baru

Untuk membuat migration baru secara manual:

```bash
npx typeorm migration:create src/migrations/NamaMigration
```

Untuk generate otomatis berdasarkan perubahan entity:

```bash
npx typeorm migration:generate ./src/migrations/NamaMigration -d ./src/configs/ormconfig.js
```

> Pastikan semua entitas sudah disertakan di konfigurasi `entities`.

---

### 🚀 Menjalankan Migration

Untuk menjalankan semua migration yang belum dieksekusi:

```bash
npx typeorm migration:run -d ./src/configs/ormconfig.js
```

---

### 🔄 Revert Migration

Untuk membatalkan (rollback) migration terakhir:

```bash
npx typeorm migration:revert -d ./src/configs/ormconfig.js
```

---

## 📁 Struktur Folder

Direkomendasikan untuk menyusun folder seperti berikut:

```
project-root/
├── src/
│   ├── models/             # berisi semua entity
│   ├── migrations/         # berisi file migration
│   └── ormconfig.js        # konfigurasi datasource TypeORM
├── .env
└── package.json
```

---

### ⚙️ Scripts di `package.json`

Tambahkan script untuk kemudahan penggunaan:

```json
"scripts": {
  "typeorm": "typeorm",
  "migration:create": "npm run typeorm migration:create",
  "migration:generate": "npm run typeorm migration:generate",
  "migration:run": "npm run typeorm migration:run",
  "migration:revert": "npm run typeorm migration:revert"
}
```

---

## 📌 Tips

- Jangan aktifkan `synchronize: true` jika menggunakan migration.
- Jalankan migration hanya setelah database siap di production.
- Migration hanya akan merekam **perubahan pada entitas**, bukan isi data.
- Untuk insert data awal, gunakan file migration dengan perintah `queryRunner.query(...)`.

---

## 📄 Contoh Migration Manual

```js
// migrations/1690000000000-CreateUserTable.js
module.exports = class CreateUserTable1690000000000 {
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL,
        "email" VARCHAR(100) UNIQUE NOT NULL
      );
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "users"`);
  }
};
```

---

Kalau kamu menggunakan TypeScript, cukup ganti `.js` dengan `.ts` dan pastikan konfigurasi CLI TypeORM mendukung TS (`ts-node` dan `typeorm`).
