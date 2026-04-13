// Configuration: Using the specific date from the prompt
const DUE_DATE = new Date("2026-03-01T18:00:00Z");
const UPDATE_INTERVAL = 60000;

// DOM Elements
const elements = {
  card: document.querySelector('[data-testid="test-todo-card"]'),
  checkbox: document.querySelector('[data-testid="test-todo-complete-toggle"]'),
  title: document.querySelector('[data-testid="test-todo-title"]'),
  status: document.querySelector('[data-testid="test-todo-status"]'),
  timeRemaining: document.querySelector(
    '[data-testid="test-todo-time-remaining"]',
  ),
  editBtn: document.querySelector('[data-testid="test-todo-edit-button"]'),
  deleteBtn: document.querySelector('[data-testid="test-todo-delete-button"]'),
};

/**
 * Calculates time remaining based on the specific strings required by the prompt:
 * "Due in 3 days", "Due tomorrow", "Overdue by 2 hours", "Due now!"
 */
function calculateTimeRemaining() {
  const now = new Date();
  const diff = DUE_DATE - now;
  const absDiff = Math.abs(diff);

  const mins = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

  // 1. Future Dates
  if (diff > 0) {
    if (days > 1) return `Due in ${days} days`;
    if (days === 1) return "Due tomorrow";
    if (hours >= 1) return `Due in ${hours} hours`;
    if (mins > 0) return `Due in ${mins} minutes`;
    return "Due now!";
  }

  // 2. Past Dates (Overdue)
  if (days >= 1) return `Overdue by ${days} day${days > 1 ? "s" : ""}`;
  if (hours >= 1) return `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`;
  return "Overdue now!";
}

function updateUI() {
  if (elements.timeRemaining) {
    elements.timeRemaining.textContent = calculateTimeRemaining();
  }
}

function handleToggle() {
  const isChecked = elements.checkbox.checked;

  if (isChecked) {
    elements.status.textContent = "Done";
    // Apply visual strike-through via CSS class or direct style as per prompt
    if (elements.title) elements.title.style.textDecoration = "line-through";
    elements.card.classList.add("completed");
  } else {
    elements.status.textContent = "In Progress";
    if (elements.title) elements.title.style.textDecoration = "none";
    elements.card.classList.remove("completed");
  }

  console.log("Status updated to:", elements.status.textContent);
}

function init() {
  // Set initial text
  updateUI();

  // Event Listeners
  if (elements.checkbox) {
    elements.checkbox.addEventListener("change", handleToggle);
  }

  if (elements.editBtn) {
    elements.editBtn.addEventListener("click", () => {
      console.log("edit clicked");
    });
  }

  if (elements.deleteBtn) {
    elements.deleteBtn.addEventListener("click", () => {
      alert("Delete clicked");
      // Optional: Visual removal
      // elements.card.remove();
    });
  }

  // Live update
  setInterval(updateUI, UPDATE_INTERVAL);
}

// Initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
