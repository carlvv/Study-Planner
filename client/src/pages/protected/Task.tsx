import { useState } from "react";
import { Navigate } from "react-router-dom";

import { useParams } from "react-router-dom";

import { Plus } from "lucide-react";
import type { Todo } from "../../types";
import { dummyTodos } from "../../data/todos";
import Layout from "../../components/layout/Layout";
import { H2 } from "../../components/Text";
import { IconButton } from "../../components/Buttons";

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

  const todo = todos.find((todo) => todo.id === todoId)!;

  console.log(todoId);
  return (
    <Layout backURL={"/todo"}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <H2 className="py-2">{todo.titel}</H2>
          <p>{todo.text}</p>
        </div>
        <IconButton
          outerClassName="bg-primary p-3 rounded-xl"
          Icon={Plus}
          onClick={newTask}
        />
      </div>
      {!todo.aufgaben || todo.aufgaben.length === 0 ? (
        <p>Keine Tasks gefunden</p>
      ) : (
        <ul>
          {todo.aufgaben.map((task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.erledigt}
                  onChange={() => toggleTaskErledigt(task.id)}
                />
                <span className={task.erledigt ? "line-through" : ""}>
                  {task.titel}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}

function newTask() {}
