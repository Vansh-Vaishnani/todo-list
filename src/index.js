import "./styles.css";
import { initApp } from "./logic/app";
import { renderProjects } from "./ui/sidebar";
import { renderTodos } from "./ui/todos";

initApp();
renderProjects();
renderTodos();