import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

export const Home = () => {

  const API_BASE = "https://playground.4geeks.com/todo";
  const [username, setUsername] = useState("");
  const [registered, setRegistered] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Crear usuario
  const createUser = () => {
  if (!username) return alert("Ingresa un nombre de usuario");

  fetch(`${API_BASE}/users/${username}`, {
    method: "POST",
  })
    .then((resp) => {
      if (resp.ok) {
        // Usuario creado por primera vez
        setRegistered(true);
        fetchTasks();
      } else {
        // Si no se pudo crear (probablemente ya existe), intento cargarlo
        return fetch(`${API_BASE}/users/${username}`);
      }
    })
    .then((resp) => {
      if (resp && resp.ok) {
        setRegistered(true);
        fetchTasks();
      } else if (resp) {
        alert("Error al cargar usuario existente");
      }
    })
    .catch((error) => console.log(error));
};

  // Obtener tareas
  const fetchTasks = () => {
    fetch(`${API_BASE}/users/${username}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Tareas:", data);
        setTasks(data.todos || []);
      })
      .catch((error) => console.log(error));
  };

  // Agregar tarea (URL corregida ✅)
  const addTask = () => {
    if (!newTask.trim()) return;

    fetch(`${API_BASE}/todos/${username}`, {
      method: "POST",
      body: JSON.stringify({ label: newTask, is_done: false }),
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => resp.json())
      .then(() => {
        setNewTask("");
        fetchTasks();
      })
      .catch((error) => console.log(error));
  };

  // Eliminar tarea
  const deleteTask = (id) => {
    fetch(`${API_BASE}/todos/${id}`, {
      method: "DELETE",
    })
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((error) => console.log(error));
  };

  return (
    <div className="container mt-5">
      {!registered ? (
        <div className="text-center">
          <h2>👤 Crear Usuario</h2>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Escribe un nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="btn btn-primary" onClick={createUser}>
            Crear Usuario
          </button>
        </div>
      ) : (
        <div>
          <h2>📒 To-Do List de {username}</h2>
          <div className="d-flex mb-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Nueva tarea..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button className="btn btn-success" onClick={addTask}>
              ➕ Agregar
            </button>
          </div>
          <ul className="list-group">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {task.label}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteTask(task.id)}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 