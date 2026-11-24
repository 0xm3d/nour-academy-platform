import "../styles/styles.css";
import { courses } from "./data/courses.js";
import "./form.js";

// grab the elements from the page
let catalog = document.getElementById("catalog");
let counter = document.getElementById("counter");
let noResult = document.getElementById("no-results");
let levelSelect = document.getElementById("level");
let subjectSelect = document.getElementById("subject");
let searchInput = document.getElementById("search");

let cartList = document.getElementById("cart-list");
let cartEmpty = document.getElementById("cart-empty");
let cartCount = document.getElementById("cart-count");
let cartTotal = document.getElementById("cart-total");
let cartSubmit = document.getElementById("cart-submit");
// the cart, starts empty
let selected = [];

// draws the cards that match the filters
function showCourses() {
  let chosenLevel = levelSelect.value;
  let chosenSubject = subjectSelect.value;
  let search = searchInput.value.toLowerCase().trim();
  let count = 0;
  // clear the old cards first
  catalog.innerHTML = "";

  for (let i = 0; i < courses.length; i++) {
    let c = courses[i];
    // skip the course if it doesn't match a filter
    if (chosenLevel !== "" && c.level !== chosenLevel) continue;
    if (chosenSubject !== "" && c.subject !== chosenSubject) continue;

    // search: is what the user typed inside the title?
    let text = (c.title + " " + c.subject).toLowerCase();
    if (!text.includes(search)) continue;

    count++;

    // normal case, changed below if the course is full
    let seats = c.seatsRemaining + " seats left";
    let buttonText = "Add to my selection";
    let disabled = "";

    if (c.seatsRemaining === 0) {
      seats = "Full";
      buttonText = "Course full";
      disabled = "disabled";
    }

    // add one card
    // badge colour: red when full, saffron when only a few seats are left
    let badge = "badge-neutral";
    if (c.seatsRemaining === 0) badge = "badge-alert";
    else if (c.seatsRemaining <= 3) badge = "badge-pending";

    catalog.innerHTML += `
      <article class="group flex flex-col rounded-xl border border-line bg-card p-5 transition duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md">
        <div class="flex items-center justify-between gap-3">
          <p class="text-xs font-semibold tracking-wider text-brand uppercase">${c.subject}</p>
          <span class="badge ${badge}">${seats}</span>
        </div>
        <h3 class="mt-3 font-serif text-[1.375rem] leading-snug font-medium text-ink">${c.title}</h3>
        <ul class="mt-4 mb-5 grid gap-1.5 text-sm text-muted">
          <li class="flex items-center gap-2.5"><i class="fa-solid fa-graduation-cap w-4 text-center" aria-hidden="true"></i>${c.level}</li>
          <li class="flex items-center gap-2.5"><i class="fa-regular fa-clock w-4 text-center" aria-hidden="true"></i>${c.schedule}</li>
          <li class="flex items-center gap-2.5"><i class="fa-solid fa-location-dot w-4 text-center" aria-hidden="true"></i>${c.center}</li>
        </ul>
        <div class="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p class="text-ink"><span class="font-serif text-2xl">${c.price}</span> <span class="text-sm text-muted">MAD / month</span></p>
          <button type="button" data-action="add" data-id="${c.id}" ${disabled}
            class="btn btn-secondary btn-sm min-h-11 enabled:group-hover:border-brand enabled:group-hover:text-brand">
            ${buttonText}
          </button>
        </div>
      </article>`;
  }

  // show the number of results (and the message if there are none)
  counter.textContent = count + (count === 1 ? " course found" : " courses found");
  noResult.classList.toggle("hidden", count !== 0);
}

// add a course to the cart (not twice, not if full)
function addCourse(id) {
  // already in the cart, do nothing
  for (let i = 0; i < selected.length; i++) {
    if (selected[i].id === id) return;
  }

  for (let i = 0; i < courses.length; i++) {
    // a full course can't be added
    if (courses[i].id === id && courses[i].seatsRemaining > 0) {
      selected.push(courses[i]);
    }
  }

  showCart();
}

// remove a course from the cart
function removeCourse(id) {
  // keep everything except the course we remove
  let newList = [];

  for (let i = 0; i < selected.length; i++) {
    if (selected[i].id !== id) newList.push(selected[i]);
  }

  selected = newList;
  showCart();
}

// redraws the cart: rows, total, count
function showCart() {
  let total = 0;
  // a course was added, so the "add at least one course" error is no longer true
  if (selected.length > 0) document.getElementById("selection-error").textContent = "";
  cartList.innerHTML = "";

  for (let i = 0; i < selected.length; i++) {
    let c = selected[i];
    total += c.price;

    cartList.innerHTML += `
      <div class="flex items-start justify-between gap-3 border-b border-line py-3 first:pt-0 animate-rise">
        <div>
          <p class="text-sm font-semibold text-ink">${c.title}</p>
          <p class="text-xs text-muted">${c.price} MAD / month</p>
        </div>
        <button type="button" data-action="remove" data-id="${c.id}"
          class="-mr-2 min-h-11 shrink-0 rounded-md px-2 text-sm font-medium text-muted transition-colors hover:bg-alert-soft hover:text-alert">
          Remove
        </button>
      </div>`;
  }

  cartCount.textContent = selected.length;
  cartTotal.textContent = total;

  if (selected.length === 0) {
    cartEmpty.classList.remove("hidden");
    cartSubmit.disabled = true;
  } else {
    cartEmpty.classList.add("hidden");
    cartSubmit.disabled = false;
  }
}


// redraw when a filter changes
levelSelect.addEventListener("change", showCourses);
subjectSelect.addEventListener("change", showCourses);
searchInput.addEventListener("input", showCourses);

// one listener on the container, so it still works after a filter
catalog.addEventListener("click", function (event) {
  let button = event.target.closest("[data-action='add']");
  if (button) addCourse(Number(button.dataset.id));
});

cartList.addEventListener("click", function (event) {
  let button = event.target.closest("[data-action='remove']");
  if (button) removeCourse(Number(button.dataset.id));
});

cartSubmit.addEventListener("click", function () {
  document.getElementById("enrollment").scrollIntoView({ behavior: "smooth" });
});

// form.js says the enrollment worked, so empty the cart
document.addEventListener("registration-success", function () {
  selected = [];
  showCart();
  showCourses();
});

// first draw when the page loads
showCourses();
showCart();