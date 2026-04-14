document.addEventListener("DOMContentLoaded", () => {
  // --- State Management ---
  let todoData = {
    title: "Complete project documentation",
    description:
      "Write comprehensive README and API docs for the entire project. This includes setup instructions, endpoint details, and deployment guidelines.",
    priority: "High",
    dueDate: "2026-03-01T18:00:00",
    status: "In Progress",
    isExpanded: false,
  };

  // --- DOM Elements ---
  const card = document.querySelector('[data-testid="test-todo-card"]');
  const viewMode = document.getElementById("todo-view-mode");
  const editForm = document.getElementById("todo-edit-form");

  // View Elements
  const displayTitle = document.querySelector(
    '[data-testid="test-todo-title"]',
  );
  const displayDesc = document.querySelector(
    '[data-testid="test-todo-description"]',
  );
  const displayPriority = document.querySelector(
    '[data-testid="test-todo-priority"]',
  );
  const displayDueDate = document.querySelector(
    '[data-testid="test-todo-due-date"]',
  );
  const displayStatus = document.querySelector(
    '[data-testid="test-todo-status"]',
  );
  const statusControl = document.querySelector(
    '[data-testid="test-todo-status-control"]',
  );
  const checkbox = document.querySelector(
    '[data-testid="test-todo-complete-toggle"]',
  );
  const timeRemaining = document.querySelector(
    '[data-testid="test-todo-time-remaining"]',
  );
  const overdueIndicator = document.querySelector(
    '[data-testid="test-todo-overdue-indicator"]',
  );
  const expandToggle = document.querySelector(
    '[data-testid="test-todo-expand-toggle"]',
  );
  const collapsSection = document.querySelector(
    '[data-testid="test-todo-collapsible-section"]',
  );

  // Form Elements
  const inputTitle = document.querySelector(
    '[data-testid="test-todo-edit-title-input"]',
  );
  const inputDesc = document.querySelector(
    '[data-testid="test-todo-edit-description-input"]',
  );
  const inputPriority = document.querySelector(
    '[data-testid="test-todo-edit-priority-select"]',
  );
  const inputDate = document.querySelector(
    '[data-testid="test-todo-edit-due-date-input"]',
  );

  // --- Logic Functions ---

  function render() {
    // Text Content
    displayTitle.textContent = todoData.title;
    displayDesc.textContent = todoData.description;
    displayPriority.textContent = todoData.priority;
    card.setAttribute("data-priority", todoData.priority);

    // Due Date
    const dateObj = new Date(todoData.dueDate);
    displayDueDate.textContent = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    displayDueDate.setAttribute("datetime", todoData.dueDate);

    // Status Sync Logic
    statusControl.value = todoData.status;
    displayStatus.textContent = todoData.status;
    checkbox.checked = todoData.status === "Done";

    if (todoData.status === "Done") {
      card.classList.add("completed");
      displayTitle.style.textDecoration = "line-through";
    } else {
      card.classList.remove("completed");
      displayTitle.style.textDecoration = "none";
    }

    updateTimeLogic();
    checkDescriptionLength();
  }

  function updateTimeLogic() {
    if (todoData.status === "Done") {
      timeRemaining.textContent = "Completed";
      card.classList.remove("overdue");
      overdueIndicator.classList.add("hidden");
      return;
    }

    const now = new Date();
    const due = new Date(todoData.dueDate);
    const diff = due - now;
    const absDiff = Math.abs(diff);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((absDiff / (1000 * 60)) % 60);

    if (diff < 0) {
      // Overdue
      card.classList.add("overdue");
      overdueIndicator.classList.remove("hidden");
      if (days > 0) {
        timeRemaining.textContent = `Overdue by ${days}d ${hours}h ${mins}m`;
      } else if (hours > 0) {
        timeRemaining.textContent = `Overdue by ${hours}h ${mins}m`;
      } else {
        timeRemaining.textContent = `Overdue by ${mins}m`;
      }
    } else {
      // Future
      card.classList.remove("overdue");
      overdueIndicator.classList.add("hidden");
      if (days > 0) {
        timeRemaining.textContent = `Due in ${days}d ${hours}h ${mins}m`;
      } else if (hours > 0) {
        timeRemaining.textContent = `Due in ${hours}h ${mins}m`;
      } else {
        timeRemaining.textContent = `Due in ${mins}m`;
      }
    }
  }

  function checkDescriptionLength() {
    // Show/hide expand button based on text length
    if (todoData.description.length < 100) {
      expandToggle.classList.add("hidden");
    } else {
      expandToggle.classList.remove("hidden");
    }
  }

  // --- Interaction Events ---

  // Edit Mode Toggle
  document
    .querySelector('[data-testid="test-todo-edit-button"]')
    .addEventListener("click", () => {
      inputTitle.value = todoData.title;
      inputDesc.value = todoData.description;
      inputPriority.value = todoData.priority;
      // Format date for datetime-local input
      const dateForInput = new Date(todoData.dueDate);
      const formattedDate = dateForInput.toISOString().slice(0, 16);
      inputDate.value = formattedDate;

      viewMode.classList.add("hidden");
      editForm.classList.remove("hidden");
      inputTitle.focus();
    });

  document
    .querySelector('[data-testid="test-todo-cancel-button"]')
    .addEventListener("click", () => {
      editForm.classList.add("hidden");
      viewMode.classList.remove("hidden");
    });

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    todoData.title = inputTitle.value;
    todoData.description = inputDesc.value;
    todoData.priority = inputPriority.value;
    todoData.dueDate = new Date(inputDate.value).toISOString();

    render();
    editForm.classList.add("hidden");
    viewMode.classList.remove("hidden");
  });

  // Status Control Sync
  statusControl.addEventListener("change", (e) => {
    todoData.status = e.target.value;
    render();
  });

  checkbox.addEventListener("change", (e) => {
    todoData.status = e.target.checked ? "Done" : "Pending";
    render();
  });

  // Expand Toggle
  expandToggle.addEventListener("click", () => {
    const isExpanded = collapsSection.classList.toggle("expanded");
    expandToggle.setAttribute("aria-expanded", isExpanded);
    expandToggle.textContent = isExpanded ? "Show Less" : "Show More";
  });

  // Delete
  document
    .querySelector('[data-testid="test-todo-delete-button"]')
    .addEventListener("click", () => {
      if (confirm("Delete this task?")) card.remove();
    });

  // Initial Start
  render();
  setInterval(updateTimeLogic, 30000); // Update time every 30s
});
