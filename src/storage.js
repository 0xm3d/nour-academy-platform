import { inscriptions as demoInscriptions } from "./data/data.js";

const KEY = "nour_inscriptions";

// A fresh copy of the demo data, so changes on screen never modify the original array.
function demoCopy() {
  return demoInscriptions.map((registration) => ({ ...registration }));
}

// Put the demo registrations in localStorage the first time the page opens.
if (window.localStorage.getItem(KEY) === null) {
  window.localStorage.setItem(KEY, JSON.stringify(demoCopy()));
}

// Read the saved registrations from localStorage.
// If the saved text is broken, start again from the demo data instead of crashing.
export function loadInscriptions() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY));
    if (Array.isArray(saved)) return saved;
  } catch (error) {
    console.warn("Saved registrations could not be read, demo data restored.", error);
  }
  return resetDemoData();
}

// Save the updated registrations to localStorage.
export function saveInscriptions(registrations) {
  window.localStorage.setItem(KEY, JSON.stringify(registrations));
}

// Restore the demo registrations when Reset demo data is clicked.
export function resetDemoData() {
  const registrations = demoCopy();
  saveInscriptions(registrations);
  return registrations;
}
