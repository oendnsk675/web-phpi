# Design System - PHPI Web

Project ini menggunakan visual system untuk website komunitas/pariwisata profesional:
deep blue, clean white surfaces, aksen cream dan orange, image-led sections, serta panel admin
yang sederhana dan fungsional.

## Stack

- Views: EJS dengan `express-ejs-layouts`.
- Styling: Sass di `public/assets/sass/**`, dikompilasi ke `public/assets/sass/style.css`.
- CSS framework: Bootstrap static assets di `public/assets/css/bootstrap.min.css`.
- Icons: Font Awesome, Themify Icons, Flaticon, dan asset SVG/PNG di `public/assets/images/**`.
- Interaction assets: jQuery, Slick, Owl Carousel, Fancybox, Magnific Popup, SweetAlert, Select2 styles.
- Fonts: Ubuntu dari Google Fonts, ditambah font lokal FuturaPT dan Muli.

## Visual Direction

- Public site should feel trusted, civic, and tourism-oriented.
- Use real imagery for hero, banners, activities, products, blog, partners, and team sections.
- Keep the dominant brand color deep blue, supported by white surfaces and quiet gray text.
- Use cream and orange only as accents, not as full-page dominant backgrounds.
- Admin pages should prioritize clarity, compact spacing, and fast scanning.
- Avoid introducing a new visual language such as Tailwind-style utility-heavy components,
  glassmorphism, one-off gradients, or React component patterns.

## Source Of Truth

- Sass variables: `public/assets/sass/helpers/_variables.scss`.
- Base/reset styles: `public/assets/sass/base/_base.scss`.
- Buttons: `public/assets/sass/components/_buttons.scss`.
- Forms: `public/assets/sass/components/_form.scss`.
- Section headings: `public/assets/sass/components/_section-title.scss`.
- Page banners: `public/assets/sass/components/_page-title.scss`.
- Header/navigation: `public/assets/sass/layout/_header.scss`.
- Hero: `public/assets/sass/layout/_hero-slider.scss`.
- Admin shell: `public/assets/sass/layout/admin/_dashboard.scss`.

## Color Tokens

Use existing Sass variables before adding new colors.

| Token | Value | Usage |
|---|---:|---|
| `$theme-primary-color` | `#212f8f` | Primary brand, buttons, focus, active states. |
| `$theme-secondary-color` | `#071257` | Dark blue navigation and deep surfaces. |
| `$theme-primary-color-s3` | `#4554b5` | Secondary blue CTAs and page overlays. |
| `$theme-primary-color-s4` | `#ede5fb` | Soft highlight backgrounds. |
| `$theme-primary-color-s5` | `#212f8f` | Alternate primary blue. |
| `$dark-gray` | `#030d4c` | Heading color. |
| `$body-color` | `#3b3a3d` | Body text. |
| `$text-color` | `#828086` | Muted text. |
| `$text-light-color` | `#867f93` | Secondary muted text. |
| `$section-bg-color` | `#ededef` | Light section/nav text and section backgrounds. |
| `$light` | `#f5f6f8` | Neutral light surfaces. |
| `$white` | `#fff` | Surface and text on dark backgrounds. |
| `$small-white` / `$cyan` | `#fffdd0` | Cream accent. |
| `$orange` | `#ff9900` | Warm accent only. |

## Typography

| Token | Value | Usage |
|---|---|---|
| `$base-font` | `'Ubuntu', sans-serif` | Body text, navigation, forms, controls. |
| `$heading-font` | `'Ubuntu', sans-serif` | Headings and section titles. |
| `$base-font-size` | `15px` | HTML base font size. |

Guidelines:

- Body text defaults to `15px`; paragraphs use `16px` and `line-height: 1.8em`.
- Mobile body text may reduce to `14px`.
- Section titles use `.wpo-section-title`.
- Section title `h2` uses `45px / 52px`, reducing to `32px / 40px` on mobile.
- Page title `h2` uses `60px / 60px`, reducing to `30px / 35px` on mobile.
- Hero headings may use larger display sizes only inside hero/banner contexts.

## Spacing And Layout

- Use Bootstrap containers and grid classes where the project already uses them.
- Default section rhythm is `.section-padding`: `120px 0`, `90px 0` below `991px`,
  and `80px 0` below `767px`.
- Public page sections should be full-width sections with constrained content, not nested cards.
- Preserve responsive breakpoints used in Sass mixins: `1199px`, `991px`, `767px`,
  `575px`, and smaller page-specific breakpoints.
- Avoid viewport-width font scaling. Use explicit media queries like the existing Sass.

## Buttons

Primary CTA:

```scss
.theme-btn
```

- Background: `$theme-primary-color-s3`.
- Text: `$white`.
- Padding: `20px 40px`.
- Radius: `5px`.
- Font: `16px`, `500`.
- Hover uses the existing white sweep pseudo-element.

Small CTA:

```scss
.theme-btn-sm
```

- Background: `$theme-primary-color`.
- Padding: `12px 40px`.
- Use for compact actions and admin-friendly buttons.

Secondary pill:

```scss
.theme-btn-s2
```

- White background.
- Blue border.
- Pill radius.
- Use for secondary public-site actions.

WhatsApp action:

```scss
.whatsapp-btn
```

- Use only for WhatsApp/contact actions.
- Background: `#25d366`.

## Forms

- Use the `.form` wrapper for public forms.
- Inputs, textareas, and selects should have square edges by default (`border-radius: 0`)
  unless the local component already defines another shape.
- Focus state uses `$theme-primary-color` border and matching shadow.
- Native selects should preserve the custom select icon background.
- Image previews should use the existing `.preview-image` or `#preview-container .preview-box`
  patterns with `object-fit: cover`.
- Select2 single selections should remain `37px` tall to match existing admin forms.

## Header And Navigation

- Public navigation is controlled by `.site-header` and `.header-style-*`.
- The primary navigation background is `$theme-primary-color`.
- Desktop menu links use medium-weight, capitalized text.
- Mobile navigation slides from the right at `280px` width.
- Keep mobile menu controls circular and high contrast.
- Do not replace the current navigation with a different framework or component model.

## Hero And Page Titles

- Hero sections are image-first and should use actual banner imagery.
- `.hero` height is `700px` desktop, then `600px`, `570px`, and `450px` depending on viewport.
- Hero captions are centered by default and can use `.hero-position-left` for left-aligned variants.
- Page title banners use `.wpo-page-title` with `page-title.jpg` and a blue overlay.
- Preserve readable contrast for text placed over images.

## Cards, Lists, And Content Blocks

- Public cards should feel clean and image-led, with restrained borders and shadows.
- Use existing blog, product, service, team, and testimonial patterns before creating new ones.
- Repeated items should keep consistent image ratios with `object-fit: cover`.
- Keep title, metadata, and action hierarchy clear; do not overload cards with explanatory copy.

## Admin Dashboard

- Dashboard shell uses `.wpo-dashboard`.
- Sidebar collapsed width is `60px`; active desktop width is `15%` or `20%` below `1280px`.
- Sidebar background is white with a soft shadow.
- Active/hover navigation uses `$theme-primary-color`, right border, and light gray background.
- Below `991px`, sidebar becomes compact and relative; labels remain hidden.
- Admin content should be dense, scannable, and practical rather than marketing-oriented.

## Icons And Assets

- Prefer existing icon systems: Font Awesome, Themify Icons, Flaticon, and existing SVG assets.
- Do not introduce a new icon package unless the user explicitly asks.
- Use assets from `public/assets/images/**` for public sections.
- Keep logos from existing files such as `logo.svg`, `logo-2.svg`, `Logo-HPI.webp`,
  `logo-phpi.png`, and `logo/logo-circle.svg`.

## Motion And Interaction

- Existing animation libraries include Animate.css, WOW-style visibility hooks, Slick, Owl,
  Fancybox, and Magnific Popup.
- Keep animations subtle and purposeful.
- Preserve hover transitions on links, buttons, menus, and carousel controls.
- Avoid adding heavy animation to admin workflows.

## Accessibility

- Maintain visible focus states for links, buttons, form controls, and menu toggles.
- Preserve text contrast over image overlays.
- Use semantic headings in EJS pages.
- Keep form labels visible and associated with inputs where practical.
- Do not rely on color alone for status, validation, or destructive actions.

## Implementation Rules

- Edit Sass partials under `public/assets/sass/**`, not generated CSS, unless the task explicitly
  requires a compiled artifact.
- After Sass changes, compile or run `pnpm styles:watch` when feasible.
- Reuse EJS components in `src/views/components/**` and layouts in `src/views/layouts/**`.
- Do not introduce React, Tailwind, shadcn/ui, CSS modules, or CSS-in-JS.
- Keep public pages visually rich with real imagery; keep admin pages compact and task-focused.
