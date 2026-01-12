import { getProjects, setCurrentProject, getCurrentProjectIndex, deleteProject } from "../logic/app";
import { renderTodos } from "./todos";
import { openProjectModal } from "./modal";

export function renderProjects() {
  const sidebar = document.getElementById("projects");
  const currentIndex = getCurrentProjectIndex();
  
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <h2>Projects</h2>
      <button class="btn-add-project" id="add-project-btn" title="Add Project">
        <i class="fas fa-plus"></i>
      </button>
    </div>
    <div id="projects-list"></div>
  `;

  const projectsList = document.getElementById("projects-list");

  getProjects().forEach((project, index) => {
    // Count only active (not completed) todos
    const activeTodosCount = project.todos.filter(todo => !todo.completed).length;
    
    const projectItem = document.createElement("div");
    projectItem.className = `project-item ${index === currentIndex ? "active" : ""}`;
    
    projectItem.innerHTML = `
      <button class="project-btn">
        <span class="project-name">${project.name}</span>
        <span class="todo-count">${activeTodosCount}</span>
      </button>
      <button class="delete-project-btn" title="Delete Project">
        <i class="fas fa-trash-alt"></i>
      </button>
    `;
    
    // Switch project on click
    const projectBtn = projectItem.querySelector(".project-btn");
    projectBtn.onclick = () => {
      setCurrentProject(index);
      renderProjects();
      renderTodos();
    };
    
    // Delete project
    const deleteBtn = projectItem.querySelector(".delete-project-btn");
    if (deleteBtn) {
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
          if (deleteProject(index)) {
            renderProjects();
            renderTodos();
          }
        }
      };
    }
    
    projectsList.appendChild(projectItem);
  });
  
  // Add project button handler
  document.getElementById("add-project-btn").onclick = () => {
    openProjectModal();
  };
}
