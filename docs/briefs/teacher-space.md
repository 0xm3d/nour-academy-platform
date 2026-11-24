# Nour Academy — Part 3: Teacher Area (original brief)

> **About this document.** This is the original project brief for the third Nour Academy application, preserved for traceability.
> Its requirements are unchanged. Only the formatting was cleaned up, code names were put back in code format (including the French identifiers the brief uses: `groupes`, `eleves`, `creerLigne`, `nom`, `prenom`), and a few words mistranslated from French were corrected: "note" → *grade* (*note*), "make the call" → *take attendance* (*faire l'appel*) and "best group average forward" → *best group average highlighted* (*mis en avant*).
> It describes what was **asked for** at the time, not what the unified platform does today. For the current project, see the [main README](../../README.md).

| | |
| --- | --- |
| Original repository | [0xm3d/Nour-Academy-Teacher-Space](https://github.com/0xm3d/Nour-Academy-Teacher-Space) |
| Brief | Nour Academy — Part 3: teacher area |
| Format | Individual work, 4 days |

## Customer request

> **From:** Salma Idrissi, project manager — Sahla Digital
> **To:** Front-end developers
> **Subject:** Nour Academy — Part 3: teacher area
>
> Hello,
>
> After the parent portal and the back office, Nour Academy wants a simple tool for its teachers: take attendance, enter grades and see the results of each group. Individual mission, in native JavaScript and without a server.
>
> Salma

## The company and its problem

The 40 teachers of the 3 centres record attendance and grades on paper: parents discover absences at the end of the month, and calculating averages takes 2 hours per group per month.

**Quantified objective:** attendance taken in under 2 minutes, group average in one click, students with 3 absences reported the same day.

## Users and personas

- **Laila, maths teacher (2nd year Baccalaureate, Nador Centre):** takes attendance on her phone at the start of the session; wants to mark who is absent and enter a grade quickly.
- **Mr. Bennani, director:** wants to see the students on alert and the average of each group.

## User stories and acceptance criteria

**Starting data** in `data.js`, loaded before `script.js`: `groupes` (3 objects `{ id, nom, cours }`) and `eleves` (at least 15 fictitious objects `{ id, prenom, nom, groupeId, telephoneParent, absences, notes }`, `notes` being an array of numbers).

**US1 — Display the group (D1).** *As a teacher, I want to see my students in order to start the session.*

- The rows are produced with `eleves.map(creerLigne)` and then added with `append`; `creerLigne` uses `createElement`, `textContent` and `classList`. No hard-coded students in the HTML, no `innerHTML` for the data.
- Each row: name, number of absences, average ("13.5 / 20", or "—" when there is no grade); a counter "15 students".

**US2 — Choose a group and search (D2).** *As a teacher, I want to display a single group and find a student in order to work quickly.*

- Drop-down list generated from `groupes` (`change` event); instant search (`input` event) by first or last name, case-insensitive.
- The two criteria combine in a single `filter`; the number of results is displayed, with a message if no student matches.

**US3 — Take attendance and grade (D3).** *As a teacher, I want to mark a student absent or add a grade in one click in order to stop using the paper sheet.*

- A single listener on the rows container (delegation, `closest`, `data-id`) handles "Absent" and "Add grade", even after filtering; the student is found with `find`.
- A grade is refused with a message if it is not a number between 0 and 20.
- At 3 absences, the row goes into alert (a class and a "Notify parents" badge); only the row concerned is updated.

**US4 — Add a student (D4).** *As a teacher, I want to add a student who arrived during the year so that they can be followed from today.*

- Fields: first name, last name, group, parent's email, parent's phone number, temporary access code to the parent area.
- Real-time validation with regular expressions: first and last name (letters, spaces, hyphens, 2 characters minimum); email; Moroccan mobile number 06/07 + 8 digits or +212 6/7 + 8 digits; code of at least 8 characters with an uppercase letter, a digit and a special character.
- Under each field, a specific error or success message; the border changes state.
- Sending is blocked as long as a field is invalid (`every`), if the student already exists in this group (`some`) or if the group has 15 students; focus moves to the first field in error.
- Otherwise, the student (without the code) is added to the array and to the list; the form is emptied.

**US5 — Group report (D5).** *As the director, I want to see the state of a group in order to identify students who are dropping out.*

- Group average and total absences calculated with `reduce`; number of students on alert with `filter`.
- A "Parents to call" list ("first name last name — phone") built with `filter` and `map`.
- "No students on alert" is displayed when `every` confirms it; the report follows each absence, grade or addition.

### Bonus (excellence)

- **B1** Sort by average or by name (`sort` on a copy of the array).
- **B2** Access code strength gauge (weak / medium / strong).
- **B3** A student's record (all their grades) in a `<dialog>`, closed with Esc or by clicking outside the box.
- **B4** Best group average highlighted.

## Constraints

- Organisation: one Jira (or GitHub Projects) ticket per story; branch `feature/<key>-<description>` (e.g. `feature/NOUR-41-appel`), key in the commits; merge into `main` through a described PR; GitHub Pages updated with each story.
- Native JavaScript, without libraries; separate HTML, CSS and JS, no `onclick` and no `style="…"`; `const` and `let` only.
- No `for` loop to search, filter, transform or count: an array method suited to each need; `forEach` is reserved for adding elements to the DOM.
- Style justified in the README: native CSS (charter in `:root`) or Tailwind CSS v4 via Vite (CDN prohibited).
- Mobile first: from 360 px, touch targets of at least 44 px, correct rendering up to 1440 px.
- Law 09-08 (CNDP): fictitious data only; the access code is neither displayed nor stored.

## Definition of Done

A story is finished when: its criteria are checked on mobile and desktop; the console is error-free; the PR is described and merged; the ticket is *Done*; the online version is up to date.

## Teaching arrangements

- **Individual** · 4 days.
- Launch: Monday 10/19/2026 at 09:30 · Delivery: Thursday 10/22/2026 before 5:30 p.m.
- No lecture: each concept is discovered through the brief and the documentation; if several learners are stuck, a short live-coding session is led by a learner (driver) while the room guides.
- 10-minute stand-up every morning: done, in progress, blockers; the previous day's bugs are shared.
- "Rule of 3 before me": official documentation → a peer → the class → the trainer.
- Self-assessment on the performance criteria before the debriefing.

## Evaluation

- **Presentation (CT6N1):** 5-minute demo of the online site, from taking attendance to the group report.
- **Code review:** Git, PR and board history.
- **Live coding (CT3N2, CT4N2):** a small live change (e.g. a new filter, a new figure in the report); the learner first states the problem, then the array method chosen and why.
- **Sharing (CT5N2):** a bug encountered, its cause and the chosen solution, described in the README.
- **Q&A:** questions from the trainer and at least 2 questions from peers (e.g. "Why `find` and not `filter` here?", "What happens without delegation after filtering?").

## Deliverables

To be submitted before **Thursday 10/22/2026 at 5:30 p.m.**:

- Link to the Jira or GitHub Projects board.
- Link to the individual GitHub repository with one PR per user story and a README: context, features, mobile and desktop screenshots, a "need → array method used" table, regular expressions with the valid and invalid cases tested, difficulties and solutions, sources, site link.
- Link to the site deployed on GitHub Pages.

## Performance criteria

- **C1N1:** individual repository with a branch and a PR per user story, ticket key in branches and commits, GitHub Pages site up to date, error-free console.
- **C2N1:** each user story becomes a ticket with its criteria; the interface states (no results, grade refused, student on alert, full group, field in error, successful addition) are planned and understandable by Laila and Mr. Bennani.
- **C3N1:** semantic HTML; each field has a label and an associated message; correct display from 360 px to 1440 px without horizontal scrolling; touch targets of at least 44 px.
- **C4N1:** no hard-coded students in the HTML; elements created and modified with the DOM API (`createElement`, `textContent`, `classList`, `append`); delegation that works after filtering; an array method suited to each need (`map`, `filter`, `find`, `some`, `every`, `reduce`); each regular expression tested on valid and invalid cases; sending blocked as long as the form is invalid; `const` and `let` only.
