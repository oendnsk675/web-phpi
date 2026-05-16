## Commit Message Guidelines

Project ini menggunakan format commit yang konsisten agar riwayat perubahan mudah dibaca,
mudah ditelusuri, dan siap dipakai untuk changelog bila dibutuhkan.

## Commit Message Format

Setiap commit terdiri dari header, body opsional, dan footer opsional:

```text
<type>(<scope>): <subject>

<body>

<footer>
```

Header wajib. Scope opsional, tetapi disarankan untuk perubahan yang jelas domainnya.
Panjang setiap baris maksimal 100 karakter.

Contoh:

```text
feat(products): add product image upload
```

```text
fix(auth): prevent inactive users from logging in

Check the user's active status before creating the session.
```

## Revert

Jika commit membatalkan commit sebelumnya, gunakan format:

```text
revert: <original commit header>

This reverts commit <hash>.
```

## Type

Gunakan salah satu type berikut:

- `build`: perubahan build system, scripts, package manager, atau dependency tooling.
- `ci`: perubahan konfigurasi CI atau deployment automation.
- `docs`: dokumentasi saja.
- `feat`: fitur baru.
- `fix`: perbaikan bug.
- `perf`: perubahan yang meningkatkan performa.
- `refactor`: perubahan struktur kode tanpa fitur baru atau bug fix.
- `style`: formatting, whitespace, atau perubahan style code yang tidak mengubah behavior.
- `test`: penambahan atau perbaikan test.
- `chore`: maintenance umum yang tidak masuk kategori lain.

## Scope

Scope adalah modul atau domain yang terdampak. Gunakan scope yang paling spesifik.

| Scope | Description |
|---|---|
| `auth` | Login, register, session, flash auth flow, dan middleware auth. |
| `users` | User model, admin users, profile, member data, dan kartu member. |
| `members` | Public/member directory, member pages, guide search, dan guide profile. |
| `products` | Product routes, product controllers, services, locations, dan product pages. |
| `posts` | Blog/post routes, post controllers, comments, tags, dan post pages. |
| `categories` | Category model, admin category CRUD, dan category seed data. |
| `locations` | Location/admin location flows dan location seed data. |
| `directory` | Directory route, controller, filters, dan directory page. |
| `reviews` | Review model, review route, review controller, dan testimonial behavior. |
| `views` | EJS layouts, pages, components, and partials. |
| `admin` | Dashboard shell, admin sidebar, and panel pages. |
| `assets` | Sass, CSS, JavaScript assets, images, fonts, and static frontend files. |
| `uploads` | Multer config, uploaded files handling, image processing, and upload paths. |
| `db` | TypeORM models, migrations, PostgreSQL config, and seeders. |
| `config` | Environment config, server config, nodemon, Makefile, and app bootstrap. |
| `deps` | `package.json`, `pnpm-lock.yaml`, and dependency changes. |
| `docs` | Documentation files such as `README.MD`, `AGENTS.md`, `COMMIT.md`, and `DESIGN.md`. |

Use no scope for broad changes that intentionally span many areas:

```text
style: format js and ejs files
```

## Subject

- Use imperative, present tense: `add`, not `added` or `adds`.
- Do not capitalize the first letter.
- Do not end with a period.
- Keep it short and specific.

Good:

```text
fix(products): keep uploaded image previews square
```

Bad:

```text
Fixed Products Page.
```

## Body

Use the body when the motivation or behavior change is not obvious from the header.

- Explain why the change is needed.
- Contrast new behavior with previous behavior when helpful.
- Keep lines under 100 characters.

Example:

```text
fix(db): require unique member registration numbers

Prevent duplicate registration numbers before saving users so admin search and member cards
always point to a single member record.
```

## Footer

Use the footer for breaking changes and issue references.

Breaking changes must start with `BREAKING CHANGE:`.

```text
BREAKING CHANGE: rename POSTGRES_DATABASE to POSTGRES_DB
```

Issue references:

```text
Closes #42
```

## Project-Specific Notes

- Database schema changes must include the related TypeORM migration.
- UI changes should reference `DESIGN.md` and preserve the existing Sass/EJS conventions.
- Do not mention generated files in the subject unless the generated output is the main change.
- Keep commits focused. Prefer multiple small commits over one broad commit when changes are unrelated.
