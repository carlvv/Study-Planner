import { useState } from "react";
import { Navigate } from "react-router-dom";
import type { Todo } from "../types";
import { dummyTodos } from "../data/todos";
import { Button_Primary_Action, Button_Primary } from "../componenten/Buttons";
import { useParams } from "react-router-dom";

export default function Tasks() {
  const [todos, setTodos] = useState<Todo[]>(dummyTodos); //TODO: richtige Datenbank ansteuern
  const params = useParams<{ todoId: string }>();

  const userMatrikelnummer: number = 12345; //TODO: matrikelnummer lesen

  if (!userMatrikelnummer) {
    return <Navigate to="/login" />;
  }

  const todoId: number = Number(params.todoId);

  if (
    isNaN(todoId) ||
    !todos.find((todo) => todo.id === todoId) ||
    todos.find((todo) => todo.id === todoId)?.matrikelnummer !==
      userMatrikelnummer
  ) {
    //TODO: Error-Seite
  }

  const toggleTaskErledigt = (taskId: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              aufgaben: todo.aufgaben.map((task) =>
                task.id === taskId
                  ? { ...task, erledigt: !task.erledigt }
                  : task
              ),
            }
          : todo
      )
    );

    //TODO: Daten speichern
  };

  //richtige Tasks holen
  const userTasks = todos.find((todo) => todo.id === todoId)?.aufgaben;

  console.log(todoId);
  return (
    <div>
      <Button_Primary to="/todo">&larr;</Button_Primary>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Meine Tasks</h1>
        <Button_Primary_Action onClick={newTask}>+</Button_Primary_Action>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!userTasks || userTasks.length === 0 ? (
          <p>Keine Tasks gefunden</p>
        ) : (
          <ul>
            {userTasks.map((task) => (
              <li key={task.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.erledigt}
                    onChange={() => toggleTaskErledigt(task.id)}
                  />
                  <span
                    style={{
                      textDecoration: task.erledigt ? "line-through" : "none",
                    }}
                  >
                    {task.titel}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function newTask() {}
