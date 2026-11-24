// grab the form fields
import { courses } from "./data/courses.js";
import { loadInscriptions, saveInscriptions } from "./storage.js";
import { isValidName, isValidEmail, isValidPhone, isValidPassword, isDuplicateRegistration, isGroupFull } from "./validation.js";

let form = document.getElementById("enroll-form");
let parentName = document.getElementById("parent-name");
let email = document.getElementById("email");
let phone = document.getElementById("phone");
let studentName = document.getElementById("student-name");
let studentLevel = document.getElementById("student-level");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirm-password");
let consent = document.getElementById("consent");
let selectionError = document.getElementById("selection-error");
let summary = document.getElementById("registration-summary");
let summaryText = document.getElementById("registration-summary-text");

// shows the message and the green/red border, returns true if valid
function show(input, ok, text) {
  let msg = document.getElementById(input.id + "-msg");
  msg.textContent = text;
  input.classList.remove("border-gray-300", "border-green-600", "border-red-600");
  input.classList.add(ok ? "border-green-600" : "border-red-600");
  msg.className = ok ? "text-[14px] text-green-600" : "text-[14px] text-red-600";
  return ok;
}

// one check per field
function checkParentName() {
  if (!isValidName(parentName.value)) return show(parentName, false, "Enter the parent's name.");
  return show(parentName, true, "Valid name.");
}

// email: something@something.something
function checkEmail() {
  if (!isValidEmail(email.value)) return show(email, false, "Invalid email address. Example: name@example.com");
  return show(email, true, "Valid email address.");
}

// phone: 06/07 + 8 digits, or +212 6/7 + 8 digits
function checkPhone() {
  if (!isValidPhone(phone.value)) return show(phone, false, "Invalid number. Example: 0612345678 or +212612345678.");
  return show(phone, true, "Valid phone number.");
}

function checkStudentName() {
  if (!isValidName(studentName.value)) return show(studentName, false, "Enter the student's first name.");
  return show(studentName, true, "Valid first name.");
}

function checkStudentLevel() {
  if (studentLevel.value === "") return show(studentLevel, false, "Choose the student's level.");
  return show(studentLevel, true, "Level selected.");
}

// password: 8 characters min., 1 uppercase letter, 1 digit, 1 special character
function checkPassword() {
  if (!isValidPassword(password.value)) {
    return show(password, false, "At least 8 characters, with 1 uppercase letter, 1 digit and 1 special character.");
  }
  return show(password, true, "Strong enough password.");
}

function checkConfirmPassword() {
  if (confirmPassword.value === "" || confirmPassword.value !== password.value) {
    return show(confirmPassword, false, "The two passwords must match.");
  }
  return show(confirmPassword, true, "Passwords match.");
}

function checkConsent() {
  if (!consent.checked) return show(consent, false, "You must accept this statement to continue.");
  return show(consent, true, "Thank you for your consent.");
}

// check while the user types
parentName.addEventListener("input", checkParentName);
email.addEventListener("input", checkEmail);
phone.addEventListener("input", checkPhone);
studentName.addEventListener("input", checkStudentName);
studentLevel.addEventListener("change", checkStudentLevel);
password.addEventListener("input", function () {
  checkPassword();
  if (confirmPassword.value !== "") checkConfirmPassword();
});
confirmPassword.addEventListener("input", checkConfirmPassword);
consent.addEventListener("change", checkConsent);

// when the form is submitted
form.addEventListener("submit", function (event) {
  event.preventDefault();
  summary.classList.add("hidden");
  selectionError.textContent = "";

  // Check each field in order and focus the first one that is invalid.
  if (!checkParentName()) return parentName.focus();
  if (!checkEmail()) return email.focus();
  if (!checkPhone()) return phone.focus();
  if (!checkStudentName()) return studentName.focus();
  if (!checkStudentLevel()) return studentLevel.focus();
  if (!checkPassword()) return password.focus();
  if (!checkConfirmPassword()) return confirmPassword.focus();
  if (!checkConsent()) return consent.focus();

  // no course selected, stop here
  let selectedCourseIds = Array.from(
    document.querySelectorAll("#cart-list [data-action='remove']")
  ).map((button) => Number(button.dataset.id));
  if (selectedCourseIds.length === 0) {
    selectionError.textContent = "Add at least one course to your selection before submitting the enrollment.";
    document.getElementById("courses").scrollIntoView({ behavior: "smooth" });
    return;
  }

  let selectedCourses = selectedCourseIds.map((id) =>
    courses.find((course) => course.id === id)
  );
  if (selectedCourses.some((course) => !course)) {
    selectionError.textContent = "A selected course could not be found. Please update your selection.";
    return;
  }

  let student = studentName.value.trim();
  let registrations = loadInscriptions();

  // refuse a duplicate (same student, same course) or a full group (15 students)
  for (let i = 0; i < selectedCourses.length; i++) {
    let course = selectedCourses[i];
    if (isDuplicateRegistration(registrations, student, course.id)) {
      selectionError.textContent = student + " is already registered in " + course.title + ".";
      return;
    }
    if (isGroupFull(registrations, course.id)) {
      selectionError.textContent = course.title + " is full (15 students). Please remove it from your selection.";
      return;
    }
  }

  let level = studentLevel.options[studentLevel.selectedIndex].text;
  let registrationNumber = "NA-" + new Date().getFullYear() + "-" + Date.now();
  let newRegistrations = selectedCourses.map((course, index) => ({
    id: Date.now() + index,
    dossier: registrationNumber,
    parentName: parentName.value.trim(),
    email: email.value.trim(),
    student: student,
    level: level,
    courseId: course.id,
    course: course.title,
    phone: phone.value.replace(/\s/g, ""),
    status: "Pending",
    date: new Date().toISOString().slice(0, 10)
  }));

  try {
    saveInscriptions([...registrations, ...newRegistrations]);
  } catch (error) {
    console.error("Could not save the parent registration.", error);
    selectionError.textContent = "Your registration could not be saved. Please try again.";
    return;
  }

  let total = selectedCourses.reduce((sum, course) => sum + course.price, 0);
  summaryText.textContent = "Enrollment " + registrationNumber + " confirmed. Student: " + student + " (" + level + "). Courses: " + selectedCourses.map((course) => course.title).join(", ") + ". Total: " + total + " MAD / month.";
  summary.classList.remove("hidden");

  // empty the form and remove the red/green borders
  form.reset();
  let inputs = [parentName, email, phone, studentName, studentLevel, password, confirmPassword, consent];
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].classList.remove("border-green-600", "border-red-600");
    inputs[i].classList.add("border-gray-300");
    let msg = document.getElementById(inputs[i].id + "-msg");
    msg.textContent = "";
    msg.className = "text-[14px]";
  }

  // tell main.js to empty the cart
  document.dispatchEvent(new Event("registration-success"));
});