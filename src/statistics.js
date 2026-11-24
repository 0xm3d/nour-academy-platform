import "../styles/styles.css";
import { courses } from "./data/courses.js";
import { loadInscriptions } from "./storage.js";
import { calculateStatistics, escapeHTML } from "./utils.js";
import { renderTable } from "./ui/table.js";

const registrations = loadInscriptions();
const statistics = calculateStatistics(registrations, courses);

document.getElementById("stat-total").textContent = statistics.total;
document.getElementById("stat-pending").textContent = statistics.statusCounts.Pending;
document.getElementById("stat-validated").textContent = statistics.statusCounts.Validated;
document.getElementById("stat-paid").textContent = statistics.statusCounts.Paid;
document.getElementById("stat-revenue").textContent =
    `${new Intl.NumberFormat("en-US").format(statistics.revenue)} MAD`;
document.getElementById("occupancy-list").innerHTML = statistics.occupancy.map((course) => `
    <li class="grid gap-2 border-b border-line py-3">
        <div class="flex justify-between gap-4 text-sm">
            <span class="text-ink">${escapeHTML(course.title)}</span>
            <span class="shrink-0 tabular-nums ${course.students >= 15 ? "font-semibold text-alert" : "text-muted"}">${course.students} / 15 · ${course.percentage}%</span>
        </div>
        <progress class="meter ${course.students >= 15 ? "is-full" : ""}" value="${Math.min(course.students, 15)}" max="15" aria-label="Occupancy of ${escapeHTML(course.title)}"></progress>
    </li>
`).join("");
document.getElementById("registrations-count").textContent =
    `${registrations.length} registrations`;

renderTable(registrations, false);
