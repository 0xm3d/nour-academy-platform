# Nour Academy — Part 1: Parent Registration Portal (original brief)

> **About this document.** This is the original project brief for the first Nour Academy application, preserved for traceability.
> Its requirements are unchanged. Only the formatting was cleaned up: code names are back in code format, and two words that had been mistranslated from French were corrected ("map" → *course card*, "earphone" → *event listener*).
> It describes what was **asked for** at the time, not what the unified platform does today. For the current project, see the [main README](../../README.md).

| | |
| --- | --- |
| Original repository | [0xm3d/Nour-Academy](https://github.com/0xm3d/Nour-Academy) |
| Brief | Brief 3 — Nour Academy: Parent Registration Portal (Part 1) |
| Format | Individual work, 5 days |

Nour Academy, a network of 3 academic and language support centres in Nador, wants parents to find the right course and send a complete registration file from their phone.

## Project context

Nour Academy welcomes 1,400 students per year, from primary school to the Baccalaureate, in its centres in Nador Centre, Hay Al Matar and Selouane. 60% of registrations arrive by WhatsApp and 40% at the counter, from a PDF brochure: 1 in 4 parents cannot find the right course, and 35% of files are incomplete or false (wrong phone number, level forgotten). The 2 secretaries spend around 15 hours a week calling parents back.

The director, Mr. Bennani, entrusts the Sahla Digital agency with a registration portal for parents. **Quantified objective:** go under 15% of incomplete files from the next session, blocking everything that is false at entry.

There is no server yet: everything happens in the browser. The file sent is confirmed to the parent by a summary; the secretariat's back office will be the subject of Part 2.

### Target users

- **Fatima, 41**, mother of two students (middle school and 2nd year Baccalaureate): entry-level Android smartphone, irregular 4G, little time. Wants to find a course quickly and be sure that her file is complete.
- **Yassine, 17**, 2nd year Baccalaureate student: compares maths and physics courses from his phone.
- **Khadija, secretary**: will handle the files in Part 2; wants clean and complete data.

## Work requested

### Organisation (D1)

- Create a Jira board (or GitHub Projects): one ticket per user story with its acceptance criteria, columns *To do / In progress / In review / Done*.
- Connect Jira to GitHub: ticket key in the branch `feature/<jira-key>-<description>` (e.g. `feature/NOUR-3-filters`), in each commit and in the PR.
- Merge into `main` only through a described pull request (what, how to test); at least one commit per half-day of work.
- Put a first static page online on GitHub Pages from D1, then after each completed user story.

### User stories (D1–D5)

**US1 — Browse the catalogue (D1).** *As a parent, I want to see which courses are available so I can choose the right one for my child.*

- The course cards are generated in JavaScript from an array of at least 12 courses (title, subject, level, time slot, price, remaining places): no card is hard-coded in the HTML.
- Price in the format "350 MAD / month"; a course with 0 places displays "Full" and its button is disabled.

**US2 — Filter (D2).** *As a parent, I want to filter by level and subject to save time.*

- The two filters combine, without reloading the page.
- The number of results is displayed; if no course matches, a message says so.

**US3 — Build my selection (D3).** *As a parent, I want to add and remove courses in order to prepare the registration.*

- A single event listener, placed on the container, handles the buttons of all cards, including after filtering.
- The selection shows the chosen courses, the monthly total in MAD and a remove button; a course cannot be added twice.

**US4 — Be guided while filling in the form (D4).** *As a parent, I want to know immediately if a field is wrong so as not to send an incomplete file.*

- Fields: parent's name, email, phone number, student's first name and level, password, confirmation, consent.
- Real-time validation with regular expressions: Moroccan mobile number in the form 06/07 + 8 digits or +212 6/7 + 8 digits; email; password of at least 8 characters with an uppercase letter, a digit and a special character; identical confirmation.
- Under each field, a specific error or success message; the border changes state.

**US5 — Send my registration (D5).** *As a parent, I want a confirmation to be sure that my application has been received.*

- Sending is blocked if a field is invalid, if the selection is empty or if consent is not checked; focus moves to the first field in error.
- Otherwise: a summary (student, course, total, unique file number), then the form and the selection are reset.

### Bonus (excellence)

- **B1** Instant keyword search in course titles.
- **B2** Password strength gauge (weak / medium / strong).
- **B3** Course details in a modal, closed with Esc, with its button or by clicking outside the box.
- **B4** Two-step form with a progress bar.

## Technical constraints

- Native JavaScript: no JavaScript library or framework, no copied template.
- Style of your choice, justified in the README:
  - native CSS, with the colour charter declared as variables in `:root`;
  - or Tailwind CSS v4 installed with Vite (as in Brief 2), with the charter declared in `@theme`. The Tailwind CDN script is prohibited.
- HTML, CSS and JS in separate files: no `onclick` and no `style="…"` in the HTML; `const` and `let` only, no `var`.
- Mobile first: usable from 360 px with touch targets of at least 44 px, correct up to 1440 px.
- 3G/4G networks: page under 1 MB once online, no external API.
- Law 09-08 (CNDP): explicit consent, not pre-checked, accompanied by an information notice; no unnecessary data (no national ID number); only fictitious data in the repository.
- Interface in French, amounts in dirhams.
- No errors in the console; application deployed on GitHub Pages.

## Definition of Done

A user story is finished when: its criteria are verified on mobile and desktop; the console is error-free; the PR is described and merged; the ticket is *Done*; the online version is up to date.

## Teaching arrangements

- Individual work, 5 days: from Monday 10/19 at 10:30 a.m. to Friday 10/23 before 2:00 p.m.
- Mutual help encouraged ("rule of 3 before me": official documentation → a peer → the class → the trainer).

## Evaluation

Debriefing on Friday 10/23 at 2:30 p.m.:

- Code review: reading the Git history, the PRs and the responses to the peer review.
- 5-minute individual presentation: demo of the online site.
- Live coding and Q&A.

## Deliverables

To be submitted before Friday 10/23/2026 at 5:00 p.m.:

- Link to the Jira or GitHub Projects board.
- Link to the individual GitHub repository, with one PR per user story and a README: context, features, mobile and desktop screenshots, chosen validation rules, difficulties and solutions, sources, site link.
- Link to the site deployed on GitHub Pages.

## Performance criteria

- The board reflects the actual work: one merged PR per user story, Jira linked to GitHub, no story marked *Done* without a merged PR.
- The interface states (no results, full course, field in error, successful registration) are planned and understandable by the personas.
- The HTML is semantic; each field has a label and an associated message.
- The site displays correctly from 360 px to 1440 px, without horizontal scrolling.
- No course card is hard-coded in the HTML; the filters combine.
- The card buttons work through delegation, even after filtering.
- Each regular expression is tested on valid and invalid cases; sending is blocked as long as the file is incomplete.
- No errors in the console.
