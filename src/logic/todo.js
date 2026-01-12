export function createTodo({
  title,
  description,
  dueDate,
  priority,
}) {
  let completed = false;

  const toggleComplete = () => {
    completed = !completed;
  };

  return {
    title,
    description,
    dueDate,
    priority,
    get completed() {
      return completed;
    },
    toggleComplete,
  };
}
