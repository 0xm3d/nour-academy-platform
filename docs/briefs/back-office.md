# Nour Academy — Part 2: Secretariat Back Office (original brief)

> **About this document.** This is the original project brief for the second Nour Academy application, preserved for traceability.
> Its requirements are unchanged. Only the formatting was cleaned up, code names were put back in code format, and a few words mistranslated from French were corrected:
> "fictional game" → *fictitious data set* (*jeu de données*), "recipes of the month" → *the month's revenue* (*recettes*), "protected hand" → *protected `main`* (the branch), "binomial or trinomial" → *pairs or groups of three*, and "(30 p.m.)" → *(30 min)*.
> It describes what was **asked for** at the time, not what the unified platform does today. For the current project, see the [main README](../../README.md).

| | |
| --- | --- |
| Original repository | [0xm3d/Nour-Academy-Back-Office](https://github.com/0xm3d/Nour-Academy-Back-Office) |
| Brief | Nour Academy — Part 2: secretariat back office |
| Format | Team work (pairs or groups of three), 5 days |

## Customer request

> **From:** Salma Idrissi, project manager — Sahla Digital
> **To:** Front-end teams
> **Subject:** Nour Academy — Part 2: secretariat back office
>
> Hello everyone,
>
> Friday's demo was convincing: the parent portal is going into production. Nour Academy is now asking for the next step: a **back office** so that the secretariat can manage registrations without Excel.
>
> No server for now (the API arrives in phase 3): everything happens in the browser, and the data must survive when the tab is closed. You work in pairs or groups of three with the agency's workflow: tickets, branches, PR review. The lead developer refuses any PR that has not been reviewed.
>
> Customer demo on Monday 02/11 at 2:00 p.m.
> Salma

## The company and its problem

The 1,400 students are tracked in 3 Excel files, one per centre:

- 1 registration in 10 is entered twice;
- the monthly payment report takes the director 2 days;
- the remaining places are only known at the end of the day: 18 groups exceeded the capacity of 15 students during the last session.

**Quantified objective:** zero duplicates, zero over-capacity groups and a report available in one click.

## Users and personas

- **Khadija, secretary:** processes 40 files a day on the centre's PC (1366 px screen); wants to find a student in seconds during a phone call.
- **Mr. Bennani, director:** checks the figures on his tablet; wants to see the registrants, the statuses and the month's revenue.

## User stories and acceptance criteria

### Mandatory base

**US1 — List registrations.** *As the secretary, I want to see all registrations to get an overview.*

- On first launch, a fictitious data set of at least 20 registrations (with the structure from Part 1) is loaded, then saved in `localStorage`.
- Table: file number, student, level, course, parent's phone number, status (*Pending / Validated / Paid*), date.

**US2 — Add a registration.** *As the secretary, I want to enter a file received at the counter in order to centralise all requests.*

- The regular-expression validations from Part 1 are reused through an imported module, without copy and paste.
- Refusal with a message if the same student is already registered in the same course, or if the group has reached 15 students.

**US3 — Edit.** *As the secretary, I want to correct a file or change its status in order to track its progress.*

- Pre-filled form; on save, the row and the storage are updated without reloading.

**US4 — Delete.** *As the secretary, I want to delete a cancelled registration in order to free up a place.*

- Mandatory confirmation; the place is given back to the group.

**US5 — Search, filter, sort.** *As the secretary, I want to find a file quickly in order to answer a parent on the phone.*

- Instant search by name or phone number, case-insensitive; filter by status; sort by date or by name, ascending and descending; the three combine.
- The current search and filter are kept during the session (`sessionStorage`).

**US6 — Dashboard.** *As the director, I want to see the key figures in order to manage the centres.*

- A view reachable from a menu, without reloading: number of registrants, distribution by status, revenue collected in the format "12,600 MAD" (*Paid* status), occupancy rate per course.
- The figures are recalculated after each addition, edit or deletion.

### Bonus (excellence)

- **B1** CSV export of the filtered registrations, readable in Excel.
- **B2** Pagination of 10 rows with navigation.
- **B3** Undo the last deletion for 5 seconds.
- **B4** URL navigation (`#/registrations`, `#/dashboard`) compatible with the Back button.

## Working like a company

- Sprint planning on Monday: user stories broken down into estimated and assigned tasks on Jira (or GitHub Projects), at most 2 tickets *In progress* per person.
- Jira linked to GitHub: ticket key in the branch (`feature/NOUR-12-search`), the commits and the PR; an automation rule moves the ticket to *Done* on merge.
- `main` protected: PR described (what, why, how to test, screenshot) and approved by another member before merging.
- Each member merges at least 3 PRs and reviews at least 3.
- Code split into modules by responsibility: interface, state, storage, utilities.

## Market constraints

- Centre PC (1366 px) and the director's tablet (from 768 px).
- Unstable shared connection: once loaded, the application works without a network (no external API).
- Law 09-08 (CNDP): only fictitious data in the repository, "Reset demo data" button.
- Centre rule: 15 students maximum per group.

## Definition of Done

A user story is finished when: its criteria are verified; the data is intact after reloading; the console is error-free; the code is in ES modules (no `var`); the PR is reviewed, approved and merged; the ticket is *Done*; the online version is up to date.

## Teaching arrangements

- **Pairs or groups of three** (mixed-level teams formed by the trainer) · 5 days.
- Launch: Monday 10/26/2026 at 09:15 · Delivery: Friday 10/30/2026 before 5:30 p.m.

## Evaluation

- **Debriefing** on Friday 02/11 at 2:00 p.m. (30 min): demo of the online application first, order drawn at random; each member explains a part of the code they did not write alone; at least 2 questions from peers; comprehension questions from the trainer.
- Individual evidence: each member's merged PRs and reviews in the GitHub history and on the board.

## Deliverables

To be submitted before **Friday 10/30/2026 at 5:30 p.m.**:

- Link to the completed Kanban board (all user stories *Done*, or justified).
- Link to the team's GitHub repository: protected `main`, history of reviewed and approved PRs, README (installation, module architecture, division of work, screenshots, sources).
- Link to the deployed application.
- Customer demo during the debriefing.

## Performance criteria

- **C1N2:** protected `main`, `feature/*` branches linked to tickets, PRs reviewed before merging, working Jira–GitHub automation, modules served by a local server in development, and the application deployed.
- **C2N2:** list, form and dashboard screens designed for Khadija and Mr. Bennani, split into coherent tickets during sprint planning.
- **C3N2:** readable table, navigation between views without reloading, correct layout from 768 px to 1440 px, Lighthouse accessibility score of at least 90.
- **C4N2:** ES modules by responsibility; array methods suited to each need (search, duplicates, sorting, statistics); destructuring, spread/rest and template literals; reliable JSON persistence; complete CRUD without reloading.
