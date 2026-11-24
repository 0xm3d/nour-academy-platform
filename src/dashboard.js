import "../styles/styles.css";
import { courses } from "./data/courses.js";
import { loadInscriptions, resetDemoData, saveInscriptions } from "./storage.js";
import { calculateStatistics, escapeHTML } from "./utils.js";
import { isValidName, isValidPhone, isDuplicateRegistration, isGroupFull } from "./validation.js";
import { renderTable } from "./ui/table.js";

const body = document.getElementById("registrations-body");
const count = document.getElementById("registrations-count");
const statisticsRegistrationsBody = document.getElementById("statistics-registrations-body");
const statisticsRegistrationsCount = document.getElementById("statistics-registrations-count");
const summary = document.getElementById("registrations-summary");
const resetButton = document.getElementById("reset-demo");
const editDialog = document.getElementById("edit-registration-dialog");
const editForm = document.getElementById("edit-registration-form");
const cancelEditButton = document.getElementById("cancel-registration-edit");
const dossierInput = document.getElementById("edit-dossier");
const studentInput = document.getElementById("edit-student");
const phoneInput = document.getElementById("edit-phone");
const levelInput = document.getElementById("edit-level");
const courseInput = document.getElementById("edit-course");
const statusInput = document.getElementById("edit-status");
const dateInput = document.getElementById("edit-date");
const searchInput = document.getElementById("search");
const statusFilter = document.getElementById("status-filter");
const sortBy = document.getElementById("sort-by");
const prevButton=document.getElementById("prev-page");
const nextButton=document.getElementById("next-page")
const pageInfo=document.getElementById("page-info")
const newRegistrationButton = document.getElementById("new-registration");
const newRegistrationDialog = document.getElementById("new-registration-dialog");
const cancelNewRegistrationButton = document.getElementById("cancel-new-registration");
const newCourseInput = document.getElementById("new-course");
const newRegistrationForm = document.getElementById("new-registration-form");
const newStudentInput = document.getElementById("new-student");
const newPhoneInput = document.getElementById("new-phone");
const newStatusInput = document.getElementById("new-status");
const newLevelInput = document.getElementById("new-level");
const newDateInput = document.getElementById("new-date");
const newErrorMessage = document.getElementById("new-registration-error");
const editErrorMessage = document.getElementById("edit-registration-error");

// Check a registration before saving it. Returns an error message, or "" if everything is fine.
// ignoreId = the registration being edited (so it is not counted as its own duplicate).
function checkRegistration(student, phone, courseId, ignoreId = null) {
    if (!isValidName(student)) return "Enter the student's name (at least 2 characters).";
    if (!isValidPhone(phone)) return "Invalid phone number. Example: 0612345678 or +212612345678.";
    if (isDuplicateRegistration(registrations, student, courseId, ignoreId)) {
        return "This student is already registered in this course.";
    }
    if (isGroupFull(registrations, courseId, ignoreId)) {
        return "This group is full (15 students maximum).";
    }
    return "";
}

// Today's date in the yyyy-mm-dd format used by <input type="date">.
function today() {
    return new Date().toISOString().slice(0, 10);
}


newRegistrationButton.addEventListener("click", () => {
    newErrorMessage.textContent = "";
    newDateInput.value = today();
    newRegistrationDialog.showModal();
});


cancelNewRegistrationButton.addEventListener("click", () => {
    newRegistrationDialog.close();
});


newCourseInput.innerHTML = courses.map((course) =>
    `<option value="${course.id}">${course.title}</option>`
).join("");


newRegistrationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedCourse = courses.find(
        (course) => course.id === Number(newCourseInput.value)
    );

    if (!selectedCourse) return;

    const error = checkRegistration(newStudentInput.value, newPhoneInput.value, selectedCourse.id);
    if (error) {
        newErrorMessage.textContent = error;
        return;
    }

    const newRegistration = {
        id: Date.now(),
        dossier: `NA-${new Date().getFullYear()}-${Date.now()}`,
        student: newStudentInput.value.trim(),
        phone: newPhoneInput.value.replace(/\s/g, ""),
        level: newLevelInput.value,
        courseId: selectedCourse.id,
        course: selectedCourse.title,
        status: newStatusInput.value,
        date: newDateInput.value
    };

    registrations.push(newRegistration);

    saveInscriptions(registrations);
    renderDashboard();

    newRegistrationForm.reset();
    newRegistrationDialog.close();
});
//pagination de 10 eleve pour tout page
let currentPage=1
const itemsPerPage=10

let registrations = loadInscriptions();
let editingRegistrationId = null;


courseInput.innerHTML = courses.map((course) =>
    `<option value="${course.id}">${course.title}</option>`
).join("");


function renderDashboard() {
    summary.textContent = `${registrations.length} registrations across the 3 centers`;
    filterRegistrations();
    updateStatistics();
}

function updateStatistics() {
    const statistics = calculateStatistics(registrations, courses);
    statisticsRegistrationsCount.textContent = `${registrations.length} registrations`;
    renderTable(registrations, false, statisticsRegistrationsBody);
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
}

document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
        const showStatistics = button.dataset.view === "statistics";
        document.getElementById("registrations-view").classList.toggle("hidden", showStatistics);
        document.getElementById("statistics-view").classList.toggle("hidden", !showStatistics);

        document.querySelectorAll("[data-view]").forEach((item) => {
            const active = item === button;
            item.setAttribute("aria-current", active ? "page" : "false");
            item.classList.toggle("bg-[var(--color-primary)]", active);
            item.classList.toggle("text-white", active);
        });
    });
});

body.addEventListener("click", (event) => {
    //delete registration
    const deleteButton=event.target.closest("[data-action='delete']")
    if(deleteButton){
        const registrationId=Number(deleteButton.dataset.id)
        const confirmed=confirm("Are you want to delete this registration?")
        if(!confirmed) return
        registrations=registrations.filter(
            (registration)=>registration.id !== registrationId

        )
        saveInscriptions(registrations)
        renderDashboard()
        return



    }


    //edit registration
    const editButton = event.target.closest("[data-action='edit']");
    if (!editButton) return;

    editingRegistrationId = Number(editButton.dataset.id);
    const registration = registrations.find(({ id }) => id === editingRegistrationId);
    if (!registration) return;

    dossierInput.value = registration.dossier;
    studentInput.value = registration.student;
    phoneInput.value = registration.phone;
    levelInput.value = registration.level;
    courseInput.value = String(registration.courseId);
    statusInput.value = registration.status;
    dateInput.value = registration.date;
    editErrorMessage.textContent = "";
    editDialog.showModal();
});

// Save the edited registration and show the updated table.
editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (editingRegistrationId === null || !editForm.reportValidity()) return;

    const selectedCourse = courses.find(({ id }) => id === Number(courseInput.value));
    if (!selectedCourse) return;

    const error = checkRegistration(studentInput.value, phoneInput.value, selectedCourse.id, editingRegistrationId);
    if (error) {
        editErrorMessage.textContent = error;
        return;
    }

    registrations = registrations.map((registration) =>
        registration.id === editingRegistrationId
            ? {
                ...registration,
                student: studentInput.value.trim(),
                phone: phoneInput.value.replace(/\s/g, ""),
                level: levelInput.value,
                courseId: selectedCourse.id,
                course: selectedCourse.title,
                status: statusInput.value,
                date: dateInput.value
            }
            : registration
    );

    saveInscriptions(registrations);
    renderDashboard();
    editDialog.close();
    editingRegistrationId = null;
});

// Close the form without saving.
cancelEditButton.addEventListener("click", () => {
    editDialog.close();
    editingRegistrationId = null;
});

// Restore the demo registrations.
resetButton.addEventListener("click", () => {
    const confirmed = confirm("Reset the demo data? All changes will be lost.");
    if (!confirmed) return;
    registrations = resetDemoData();
    currentPage = 1;
    renderDashboard();
});

// Afficher les inscriptions dans le tableau
// liste = rows of the current page, total = number of results after search and filter
function renderRegistration(liste, total) {
    renderTable(liste);
    count.textContent = `${total} registrations`;
}

// Remember the search, filter and sort during the session (sessionStorage).
function saveFilters() {
    sessionStorage.setItem("nour_filters", JSON.stringify({
        search: searchInput.value,
        status: statusFilter.value,
        sort: sortBy.value
    }));
}

function restoreFilters() {
    try {
        const saved = JSON.parse(sessionStorage.getItem("nour_filters"));
        if (!saved) return;
        searchInput.value = saved.search;
        statusFilter.value = saved.status;
        sortBy.value = saved.sort;
    } catch (error) {
        sessionStorage.removeItem("nour_filters");
    }
}

// Recherche + filtre Status + tri
function filterRegistrations() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;
    const selectedSort = sortBy.value;

    // Recherche par nom ou téléphone
    let results = registrations.filter((inscription) => {
        const matchesSearch =
            (inscription.student || "").toLowerCase().includes(searchValue) ||
            String(inscription.phone || "").includes(searchValue);

        const matchesStatus =
            selectedStatus === "all" ||
            inscription.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    // Tri selon le choix de l'utilisateur
    if (selectedSort === "name-asc") {
        results.sort((a, b) =>
            a.student.localeCompare(b.student)
        );

    } else if (selectedSort === "name-desc") {
        results.sort((a, b) =>
            b.student.localeCompare(a.student)
        );

    } else if (selectedSort === "date-desc") {
        results.sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

    } else if (selectedSort === "date-asc") {
        results.sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );
    }
    // Calculate pagination
const totalPages = Math.max(1, Math.ceil(results.length / itemsPerPage));

if (currentPage > totalPages) {
    currentPage = totalPages;
}

const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedResults = results.slice(
    startIndex,
    startIndex + itemsPerPage
);

// Display current page
renderRegistration(paginatedResults, results.length);

// Update pagination controls
pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
prevButton.disabled = currentPage === 1;
nextButton.disabled = currentPage === totalPages;

}
// Pagination buttons
prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        filterRegistrations();
    }
});

nextButton.addEventListener("click", () => {
    currentPage++;
    filterRegistrations();
});

// Reset to page 1 when searching or filtering
searchInput.addEventListener("input", () => {
    currentPage = 1;
    saveFilters();
    filterRegistrations();
});

statusFilter.addEventListener("change", () => {
    currentPage = 1;
    saveFilters();
    filterRegistrations();
});

sortBy.addEventListener("change", () => {
    currentPage = 1;
    saveFilters();
    filterRegistrations();
});

window.addEventListener("storage", (event) => {
    if (event.key !== "nour_inscriptions") return;
    registrations = loadInscriptions();
    renderDashboard();
});


restoreFilters();
renderDashboard();
