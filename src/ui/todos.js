import { getCurrentProject, deleteTodoFromCurrentProject } from "../logic/app";
import { saveData } from "../logic/storage";
import { getProjects, getCurrentProjectIndex } from "../logic/app";
import { openTodoModal } from "./modal";

export function renderTodos() {
  const main = document.getElementById("todos");
  const currentProject = getCurrentProject();
  
  main.innerHTML = `
    <div class="todos-header">
      <h1>${currentProject.name}</h1>
      <button class="btn-primary" id="add-todo-btn">
        <i class="fas fa-plus"></i> Add Todo
      </button>
    </div>
    <div id="todos-list"></div>
  `;

  const todosList = document.getElementById("todos-list");
  
  if (currentProject.todos.length === 0) {
    todosList.innerHTML = '<p class="empty-message">No todos yet. Click "Add Todo" to create one!</p>';
  } else {
    currentProject.todos.forEach((todo, index) => {
      const todoCard = createTodoCard(todo, index);
      todosList.appendChild(todoCard);
    });
  }
  
  // Add event listener for add todo button
  document.getElementById("add-todo-btn").onclick = () => {
    openTodoModal();
  };
}

function createTodoCard(todo, index) {
  const card = document.createElement("div");
  card.className = `todo-card priority-${todo.priority} ${todo.completed ? "completed" : ""}`;
  
  card.innerHTML = `
    <div class="todo-header">
      <div class="todo-title-section">
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? "checked" : ""}>
        <h3 class="todo-title">${todo.title}</h3>
        <span class="priority-badge ${todo.priority}">${todo.priority}</span>
      </div>
      <div class="todo-actions">
        <button class="btn-icon edit-btn" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon delete-btn" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    
    <div class="todo-date">
      <i class="fas fa-calendar"></i> Due: ${formatDate(todo.dueDate)}
    </div>
    
    <div class="todo-description">${todo.description || "No description"}</div>
  `;
  
  // Toggle complete
  const checkbox = card.querySelector(".todo-checkbox");
  checkbox.onclick = () => {
    todo.toggleComplete();
    saveData(getProjects(), getCurrentProjectIndex());
    renderTodos();
  };
  
  // Edit todo
  const editBtn = card.querySelector(".edit-btn");
  editBtn.onclick = () => {
    openTodoModal(index, todo);
  };
  
  // Delete todo
  const deleteBtn = card.querySelector(".delete-btn");
  deleteBtn.onclick = () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      deleteTodoFromCurrentProject(index);
      renderTodos();
    }
  };
  
  return card;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Reset time part for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);
  
  if (dueDate.getTime() === today.getTime()) {
    return "Today";
  } else if (dueDate.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else {
    // Format as Month Day, Year
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
}
