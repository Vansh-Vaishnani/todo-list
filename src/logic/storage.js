import { createProject } from "./project";
import { createTodo } from "./todo";

export function saveData(projects, currentProjectIndex) {
  // Convert projects to plain objects for storage
  const plainProjects = projects.map(project => ({
    name: project.name,
    todos: project.todos.map(todo => ({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      priority: todo.priority,
      completed: todo.completed
    }))
  }));

  localStorage.setItem(
    "todo-data",
    JSON.stringify({ projects: plainProjects, currentProjectIndex })
  );
}

export function loadData() {
  const data = localStorage.getItem("todo-data");
  
  if (!data) {
    return null;
  }

  try {
    const parsed = JSON.parse(data);
    
    // Restore project objects with methods
    const projects = parsed.projects.map(plainProject => {
      const project = createProject(plainProject.name);
      
      // Restore todos with methods
      plainProject.todos.forEach(plainTodo => {
        const todo = createTodo({
          title: plainTodo.title,
          description: plainTodo.description,
          dueDate: plainTodo.dueDate,
          priority: plainTodo.priority
        });
        
        // Restore completed state
        if (plainTodo.completed) {
          todo.toggleComplete();
        }
        
        project.addTodo(todo);
      });
      
      return project;
    });

    return {
      projects,
      currentProjectIndex: parsed.currentProjectIndex
    };
  } catch (error) {
    console.error("Error loading data:", error);
    return null;
  }
}
