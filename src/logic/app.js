import { createProject } from "./project";
import { loadData, saveData } from "./storage";

let projects = [];
let currentProjectIndex = 0;

export function initApp() {
  const data = loadData();

  if (data && data.projects.length > 0) {
    projects = data.projects;
    currentProjectIndex = data.currentProjectIndex;
  } else {
    // Create initial project if no data exists
    projects.push(createProject("My Tasks"));
    saveData(projects, currentProjectIndex);
  }
}

export function getProjects() {
  return projects;
}

export function getCurrentProject() {
  return projects[currentProjectIndex];
}

export function getCurrentProjectIndex() {
  return currentProjectIndex;
}

export function setCurrentProject(index) {
  if (index >= 0 && index < projects.length) {
    currentProjectIndex = index;
    saveData(projects, currentProjectIndex);
  }
}

export function addProject(name) {
  projects.push(createProject(name));
  saveData(projects, currentProjectIndex);
}

export function deleteProject(index) {
  // Don't allow deleting if it's the only project
  if (projects.length <= 1) {
    alert("You must have at least one project!");
    return false;
  }
  
  projects.splice(index, 1);
  
  // Adjust current index if necessary
  if (currentProjectIndex >= projects.length) {
    currentProjectIndex = projects.length - 1;
  }
  
  saveData(projects, currentProjectIndex);
  return true;
}

export function addTodoToCurrentProject(todo) {
  getCurrentProject().addTodo(todo);
  saveData(projects, currentProjectIndex);
}

export function deleteTodoFromCurrentProject(index) {
  getCurrentProject().removeTodo(index);
  saveData(projects, currentProjectIndex);
}

export function updateTodoInCurrentProject(index, updatedTodo) {
  const project = getCurrentProject();
  project.todos[index] = updatedTodo;
  saveData(projects, currentProjectIndex);
}
