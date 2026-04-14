What Changed from Stage 0
Static to Stateful: The card now uses a JavaScript object as the "Source of Truth."

Edit Mode: Added a functional form to update title, description, priority, and due date.

Status Transitions: Added a three-state dropdown (Pending, In Progress, Done) that stays in sync with the completion checkbox.

Expand/Collapse: Long descriptions are now truncated and can be expanded via a keyboard-accessible toggle.

Priority Visuals: Added a dynamic priority indicator (colored dot) and border accents.

Overdue Logic: The card now detects past-due tasks, displaying an "Overdue" badge and red visual styling.

🎨 Design Decisions
Bidirectional Sync: Toggling the checkbox automatically updates the status dropdown to "Done" (and vice versa).

Red Zone: Overdue tasks receive a 6px left border accent to signify urgency.

Layout Stability: Used min-height on containers to prevent layout shift during live time updates.

♿ Accessibility
Aria Patterns: Implemented aria-expanded for the collapsible section and aria-live="polite" for the countdown timer.

Focus Management: Focus is programmatically moved to the title input when entering Edit Mode and returned to the Edit button upon saving/canceling.
