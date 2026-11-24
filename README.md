# Nour Academy — Unified project

One repository for the three Nour Academy spaces. Everything runs in the browser: there is no server yet.

| Space | Page | For |
| --- | --- | --- |
| A. Parent portal | `index.html` | Parents and students: catalogue, filters, selection, enrolment form |
| B. Back office | `dashboard.html` (+ `statistics.html`) | Secretary (registrations CRUD) and director (Statistics tab) |
| C. Teacher area | `teacher/index.html` | Teachers: attendance, grades, add a student, group summary |

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev       # development server
npm run build     # production build in dist/
npm run preview   # preview the build
```

Then open `http://localhost:5173/` (portal), `/dashboard.html` (back office) or `/teacher/` (teacher area).

## Project structure

```text
index.html            Space A – parent portal
dashboard.html        Space B – registrations + statistics views
statistics.html       Space B – standalone statistics page
images/               logo and hero image
styles/styles.css     Tailwind + colour charter of spaces A and B
src/
  main.js             portal: catalogue, filters, selection
  form.js             portal: enrolment form
  validation.js       shared rules (phone, email, password, name, duplicates, 15 max)
  storage.js          localStorage: load, save, reset demo data
  dashboard.js        back office: CRUD, search, filter, sort, pagination
  statistics.js       standalone statistics page
  utils.js            statistics calculation, escapeHTML
  ui/table.js         registrations table
  data/courses.js     the 12 courses
  data/data.js        25 fictitious demo registrations
teacher/
  index.html          Space C – teacher area
  src/data.js         groups and students (fictitious)
  src/main.js         list, search, attendance, grades, add student, summary
  src/styles.css      Tailwind + colour charter of the teacher area
```

## Design system

One visual language for the three spaces, defined once in `styles/theme.css` and imported by `styles/styles.css` (portal and back office) and `teacher/src/styles.css` (teacher area).

| | |
| --- | --- |
| Idea | Limestone paper, cedar green, and one point of saffron light (*nour*) used sparingly |
| Logo | An arch, like a doorway to learning, with a point of light inside (`images/logo.svg`) |
| Colours | `paper` / `paper-2` / `card` backgrounds, `line` borders, `ink` / `ink-soft` / `muted` text, `brand` cedar green, `saffron` accent, `ok` and `alert` (terracotta) states |
| Type | Newsreader (serif) for headings and key figures, Instrument Sans for text, forms and tables; bundled with npm (`@fontsource-variable/*`), so they work offline |
| Radius | 6 / 8 / 12 / 16 / 22 px; pills only for badges |
| Shadows | Four soft, warm levels (`shadow-xs` to `shadow-lg`) |
| Components | `.btn` (`-primary`, `-secondary`, `-ghost`, `-sm`, `.btn-icon`), `.input`, `.form-field`, `.form-label`, `.card`, `.badge` (`-paid`, `-validated`, `-pending`, `-alert`), `.kpi`, `.meter`, `.data-table`, `.modal`, `.eyebrow`, `.wordmark` |
| Icons | Font Awesome (solid and regular), already a project dependency |
| Motion | 150–250 ms colour and shadow transitions, a 1 px lift on primary buttons and cards, a short "rise" entrance for lists and dialogs; all switched off with `prefers-reduced-motion` |

Each space uses the same system in its own way: the portal is editorial and welcoming, the back office dense and information-first, the teacher area practical with large touch targets.

## How the spaces share data

- The portal and the back office share one list of registrations in `localStorage` (key `nour_inscriptions`). A file sent by a parent appears immediately in the secretary's table.
- The back office remembers its search, filter and sort in `sessionStorage` (key `nour_filters`).
- The teacher area uses its own data (`teacher/src/data.js`) kept in memory, as in the Part 3 brief. Its groups are not linked to the portal's courses.

## Access

There is no login in any space, as in the three original projects. Data never leaves the visitor's own browser, so nothing is exposed. A real login for the secretary, the director and the teachers needs the server planned for phase 3; a browser-only login would only be cosmetic.

## What changed when merging

The back-office repository already contained the parent portal (with saving to `localStorage`), so it was used as the base. The teacher area was added in `teacher/`.

**Integration**
- One `package.json` (Vite 6, Tailwind 4.3, Font Awesome). The teacher area was on Vite 8; its code needs nothing specific to Vite 8.
- `vite.config.js`: the teacher page is added to the build, and `base: "./"` uses relative paths, so the build works on Vercel or any other host.
- `teacher/index.html`: script path `/src/main.js` → `./src/main.js` (otherwise it would load the portal's script).
- Each space keeps its own stylesheet, so the two colour charters (both define `--color-muted`) never clash.
- Links between spaces: back office sidebar and portal footer → teacher area; teacher header → portal.

**Fixes — parent portal**
- Password rule added (8 characters min., 1 uppercase, 1 digit, 1 special character); before, only "passwords match" was checked.
- Names: minimum 2 characters (the old code required 4, the README said 2).
- The "add at least one course" message disappears when a course is added (fix from the original Part 1, lost in the copy).
- A parent can't register the same student twice in the same course, or in a group that already has 15 students.
- Phone numbers are saved without spaces, so the secretary's phone search finds them.
- `--color-accent` was used but never defined: the cart and centre icons had no background.
- Hero image: 1.9 MB PNG → 118 KB WebP (the brief asks for a page under 1 MB).
- Duplicate `id="contact"` removed.

**Fixes — back office**
- Regex rules are imported from `src/validation.js` (Part 2, US2), not copied.
- Add and edit refuse an invalid name or phone, a duplicate (same student, same course) and a full group (15), with a message in the form.
- Search, filter and sort are kept during the session (`sessionStorage`).
- The registrations counter shows the number of results, not the number of rows on the page.
- The button labelled "Reset filters" actually reset the data: renamed "Reset demo data" and asks for confirmation.
- After a reset, added registrations could come back at the next reset (the demo array was modified in memory). Fixed by resetting from a copy.
- Broken data in `localStorage` no longer crashes the page: the demo data is restored.
- Names are escaped before being put in the table (`escapeHTML`), so text like `<img …>` is shown, not run.
- Labels for the search and filter fields (accessibility), 44 px edit/delete buttons, new registration date defaults to today.
- Removed two unused files: `src/state.js` (empty) and `src/ui/form.js` (unused imports).

**Fixes — teacher area**
- The average used a `for…of` loop (forbidden by the Part 3 brief): now `reduce`.
- "1 absence" / "2 absences".
- Mixed French/English labels made English like the rest of the app.
- Averages shown the same way everywhere (`13.5`).
- `styles.css` was loaded twice (in the HTML and in `main.js`).
- The "Sort" list and the student record dialog were in the page but not connected: sort (on a copy of the list) and the record (Esc, ✕ or click outside to close) now work.

## Known limitations

- No real authentication (see Access).
- The portal's "seats left" comes from `courses.js` and doesn't go down with new registrations; the 15-student limit is enforced when a file is sent or added.
- Teacher-area changes are lost on reload (not required by Part 3).

## Deployment (Vercel)

1. Push the repository to GitHub.
2. On vercel.com: **Add New → Project**, then import the repository.
3. Vercel detects Vite. Keep the defaults: build command `npm run build`, output directory `dist`.
4. Each push to `main` redeploys the site.

Pages once deployed: `/` (parent portal), `/dashboard.html` (back office), `/statistics.html`, `/teacher/` (teacher area).

## Data protection

Fictitious data only (Law 09-08, CNDP). Passwords and teacher access codes are never saved.
