import { escapeHTML } from "../utils.js";

const body = document.getElementById("registrations-body");

// One badge style per status (defined in styles/theme.css)
const statusClasses = {
    Paid: "badge badge-paid",
    Validated: "badge badge-validated",
    Pending: "badge badge-pending"
};

// Draw registration rows in the dashboard table.
export function renderTable(registrations, showActions = true, targetBody = body) {
    if (!targetBody) {
        console.error("Table body not found in HTML");
        return;
    }

    targetBody.innerHTML = registrations.map((registration) => `
        <tr>
            <td class="font-medium whitespace-nowrap text-muted tabular-nums">${escapeHTML(registration.dossier)}</td>
            <td class="font-semibold whitespace-nowrap text-ink">${escapeHTML(registration.student)}</td>
            <td class="whitespace-nowrap">${escapeHTML(registration.level)}</td>
            <td class="min-w-52">${escapeHTML(registration.course)}</td>
            <td class="whitespace-nowrap tabular-nums">${escapeHTML(registration.phone)}</td>
            <td>
                <span class="${statusClasses[registration.status] || "badge badge-neutral"}">
                    ${escapeHTML(registration.status)}
                </span>
            </td>
            <td class="whitespace-nowrap tabular-nums">${escapeHTML(registration.date)}</td>
            ${showActions ? `<td class="text-right">
                <div class="flex items-center justify-end gap-1">
                    <button type="button" data-action="edit" data-id="${registration.id}" class="btn-icon"
                        aria-label="Edit ${escapeHTML(registration.student)}" title="Edit">
                        <i class="fa-solid fa-pen" aria-hidden="true"></i>
                    </button>
                    <button type="button" data-action="delete" data-id="${registration.id}" class="btn-icon is-danger"
                        aria-label="Delete ${escapeHTML(registration.student)}" title="Delete">
                        <i class="fa-regular fa-trash-can" aria-hidden="true"></i>
                    </button>
                </div>
            </td>` : ""}
        </tr>
    `).join("");
}
