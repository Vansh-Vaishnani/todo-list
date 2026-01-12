import { addTodoToCurrentProject, updateTodoInCurrentProject } from "../logic/app";
import { createTodo } from "../logic/todo";
import { renderTodos } from "./todos";

let currentEditIndex = null;

// Open modal to create a new todo
export function openTodoModal(todoIndex = null, todo = null) {
  currentEditIndex = todoIndex;
  
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  const modalRoot = document.getElementById("modal-root");
  
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>${todoIndex !== null ? "Edit Todo" : "New Todo"}</h2>
      <form id="todo-form">
        <div class="form-group">
          <label for="title">Title:</label>
          <input type="text" id="title" required value="${todo ? todo.title : ""}">
        </div>
        
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" rows="3">${todo ? todo.description : ""}</textarea>
        </div>
        
        <div class="form-group">
          <label for="dueDate">Due Date:</label>
          <input type="date" id="dueDate" required min="${minDate}" value="${todo ? todo.dueDate : ""}">
        </div>
        
        <div class="form-group">
          <label for="priority">Priority:</label>
          <select id="priority">
            <option value="low" ${todo && todo.priority === "low" ? "selected" : ""}>Low</option>
            <option value="medium" ${todo && todo.priority === "medium" ? "selected" : ""}>Medium</option>
            <option value="high" ${todo && todo.priority === "high" ? "selected" : ""}>High</option>
          </select>
        </div>
        
        <div class="form-buttons">
          <button type="submit" class="btn-primary">${todoIndex !== null ? "Update" : "Add"} Todo</button>
          <button type="button" class="btn-secondary" id="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  `;
  
  modalRoot.appendChild(modal);
  
  // Auto-focus on title input
  setTimeout(() => {
    document.getElementById("title").focus();
  }, 100);
  
  // Handle form submit
  const form = document.getElementById("todo-form");
  form.onsubmit = (e) => {
    e.preventDefault();
    
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;
    
    const newTodo = createTodo({ title, description, dueDate, priority });
    
    // If editing existing todo, preserve completed status
    if (currentEditIndex !== null && todo && todo.completed) {
      newTodo.toggleComplete();
    }
    
    if (currentEditIndex !== null) {
      updateTodoInCurrentProject(currentEditIndex, newTodo);
    } else {
      addTodoToCurrentProject(newTodo);
    }
    
    renderTodos();
    closeTodoModal();
  };
  
  // Handle cancel button
  document.getElementById("cancel-btn").onclick = closeTodoModal;
  
  // Close modal when clicking outside
  modal.onclick = (e) => {
    if (e.target === modal) {
      closeTodoModal();
    }
  };
}

// Open modal to create a new project
export function openProjectModal() {
  const modalRoot = document.getElementById("modal-root");
  
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>New Project</h2>
      <form id="project-form">
        <div class="form-group">
          <label for="project-name">Project Name:</label>
          <input type="text" id="project-name" required>
        </div>
        
        <div class="form-buttons">
          <button type="submit" class="btn-primary">Create Project</button>
          <button type="button" class="btn-secondary" id="cancel-project-btn">Cancel</button>
        </div>
      </form>
    </div>
  `;
  
  modalRoot.appendChild(modal);
  
  // Auto-focus on input
  setTimeout(() => {
    document.getElementById("project-name").focus();
  }, 100);
  
  const form = document.getElementById("project-form");
  form.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("project-name").value;
    
    // Import here to avoid circular dependency
    import("../logic/app").then(({ addProject, getProjects, setCurrentProject }) => {
      addProject(name);
      // Switch to the newly created project
      const newProjectIndex = getProjects().length - 1;
      setCurrentProject(newProjectIndex);
      
      import("./sidebar").then(({ renderProjects }) => {
        import("./todos").then(({ renderTodos }) => {
          renderProjects();
          renderTodos();
          closeTodoModal();
        });
      });
    });
  };
  
  document.getElementById("cancel-project-btn").onclick = closeTodoModal;
  
  modal.onclick = (e) => {
    if (e.target === modal) {
      closeTodoModal();
    }
  };
}

function closeTodoModal() {
  const modalRoot = document.getElementById("modal-root");
  modalRoot.innerHTML = "";
  currentEditIndex = null;
}