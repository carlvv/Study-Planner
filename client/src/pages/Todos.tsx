import { useState } from "react";
import { Navigate } from "react-router-dom";
import type { Todo } from "../types";
import { dummyTodos } from "../data/todos";
import { Button_Primary_Action, Button_Primary } from "../componenten/Buttons";
import { Link } from "react-router-dom";

export default function Todos() {
  const [todos /*, setTodos*/] = useState<Todo[]>(dummyTodos); //TODO: richtige Datenbank ansteuern

  const userMatrikelnummer = 12345; //TODO: matrikelnummer lesen

  if (!userMatrikelnummer) {
    return <Navigate to="/login" />;
  }

  // Nur Todos des eingeloggten Users
  const userTodos = todos.filter(
    (todo) => todo.matrikelnummer === userMatrikelnummer
  );

  return (
    <div>
      <Button_Primary to="/">&larr;</Button_Primary>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Meine Todos</h1>
        <Button_Primary_Action onClick={newTodo}>+</Button_Primary_Action>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {userTodos.length === 0 ? (
          <p>Keine Todos gefunden</p>
        ) : (
          <ul>
            {userTodos.map((todo) => (
              <li key={todo.id}>
                <Link to={`/todo/${todo.id}`}>
                  <h2>{todo.titel}</h2>
                  <p>{todo.text}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function newTodo() {}
