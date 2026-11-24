export function calculateStatistics(registrations, courses) {
    const statusCounts = {
        Pending: 0,
        Validated: 0,
        Paid: 0
    };
    let revenue = 0;

    registrations.forEach((registration) => {
        statusCounts[registration.status]++;

        if (registration.status === "Paid") {
            const course = courses.find(({ id }) => id === registration.courseId);
            if (course) revenue += course.price;
        }
    });

    const occupancy = courses.map((course) => {
        const students = registrations.filter(
            (registration) => registration.courseId === course.id
        ).length;

        return {
            title: course.title,
            students,
            percentage: Math.round((students / 15) * 100)
        };
    });

    return {
        total: registrations.length,
        statusCounts,
        revenue,
        occupancy
    };
}
// Make text safe before putting it inside innerHTML
// (a name like "<b>Ali</b>" is shown as text, not run as HTML).
export function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
