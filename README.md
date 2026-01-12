# Todo List

A task management application for The Odin Project JavaScript curriculum focusing on code organization, state management, and data persistence.

## Concepts Learned

### Factory Functions
- Creating objects without classes
- Using closures for private state
- Encapsulating data and methods

### Module Pattern
- Separating logic from UI code
- ES6 import/export
- Avoiding global scope pollution

### Separation of Concerns
- logic/ - Data manipulation and business rules
- ui/ - DOM updates and user interactions
- storage/ - Data persistence

### localStorage
- Storing data in the browser
- JSON serialization limitations (no functions)
- Restoring object methods after retrieval

### Key Challenge
localStorage only stores plain data, not functions. Solution: extract data before saving, reconstruct objects with methods when loading using factory functions.

## Architecture

```
src/
  logic/
    - app.js: State management
    - project.js: Project factory
    - todo.js: Todo factory
    - storage.js: localStorage operations
  ui/
    - sidebar.js: Project list
    - todos.js: Todo cards
    - modal.js: Forms
```

## Setup

```bash
npm install
npm run dev
```

## Technologies
JavaScript ES6+, Webpack, localStorage, Font Awesome, Google Fonts

---

The Odin Project - JavaScript Course