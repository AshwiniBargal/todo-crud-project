
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTodos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setTitle("");
  };

  const toggleTodo = async (todo) => {
    const res = await fetch(`${API_URL}/${todo._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });

    const updated = await res.json();

    setTodos(
      todos.map((item) =>
        item._id === updated._id ? updated : item
      )
    );
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const editTodo = async (todo) => {
    const newTitle = prompt("Edit task:", todo.title);

    if (!newTitle || !newTitle.trim()) return;

    const res = await fetch(`${API_URL}/${todo._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });

    const updated = await res.json();

    setTodos(
      todos.map((item) =>
        item._id === updated._id ? updated : item
      )
    );
  };

  const completed = todos.filter((todo) => todo.completed).length;
  const uncompleted = todos.length - completed;

  return (
    <div className="page">
      <div className="todo-box">

        <h1>To Do List</h1>

        <form onSubmit={addTodo} className="add-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button>Add</button>
        </form>

        <h2>Task List</h2>

        <div className="task-list">
          {todos.map((todo) => (
            <div className="task" key={todo._id}>

              <div className="task-name">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                />

                <span className={todo.completed ? "done" : ""}>
                  {todo.title}
                </span>
              </div>

              <div className="actions">
                <button onClick={() => deleteTodo(todo._id)}>
                  Delete
                </button>

                <button onClick={() => editTodo(todo)}>
                  Edit
                </button>
              </div>

            </div>
          ))}
        </div>

        <div className="line"></div>

        <p className="status">
          Completed: {completed} | Uncompleted: {uncompleted}
        </p>

      </div>
    </div>
  );
}

export default App;
