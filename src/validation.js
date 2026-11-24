// Validation rules shared by the parent portal (form.js) and the back office (dashboard.js).
// Write a rule once here, then import it: no copy and paste.

// Moroccan mobile: 06/07 + 8 digits, or +212 6/7 + 8 digits (spaces are ignored).
export const phoneRegex = /^(0[67][0-9]{8}|\+212[67][0-9]{8})$/;

// Email: something@something.something
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password: at least 8 characters, 1 uppercase letter, 1 digit and 1 special character.
export const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;

// Maximum number of students in one group (centre rule).
export const MAX_STUDENTS_PER_GROUP = 15;

export function isValidPhone(value) {
  return phoneRegex.test(value.replace(/\s/g, ""));
}

export function isValidEmail(value) {
  return emailRegex.test(value.trim());
}

export function isValidPassword(value) {
  return passwordRegex.test(value);
}

// A name needs at least 2 characters (spaces at the start and end don't count).
export function isValidName(value) {
  return value.trim().length >= 2;
}

// Same student already registered in the same course? (case-insensitive)
// ignoreId lets the edit form skip the registration being edited.
export function isDuplicateRegistration(registrations, student, courseId, ignoreId = null) {
  const name = student.trim().toLowerCase();
  return registrations.some((registration) =>
    registration.id !== ignoreId &&
    registration.courseId === courseId &&
    registration.student.trim().toLowerCase() === name
  );
}

// Does this course already have 15 students?
export function isGroupFull(registrations, courseId, ignoreId = null) {
  const studentsInGroup = registrations.filter((registration) =>
    registration.id !== ignoreId && registration.courseId === courseId
  );
  return studentsInGroup.length >= MAX_STUDENTS_PER_GROUP;
}
