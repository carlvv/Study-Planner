import { useState } from "react";
import { Navigate } from "react-router-dom";

import { useParams } from "react-router-dom";

import { Pencil, Plus, Save } from "lucide-react";
import type { Todo } from "../../types";
import { dummyTodos } from "../../data/todos";
import Layout from "../../components/layout/Layout";
import { H2 } from "../../components/Text";
import { IconButton } from "../../components/Buttons";

export default function Tasks() {
  const params = useParams<{ todoId: string }>();
  const todoId: number = Number(params.todoId);

  const userMatrikelnummer: number = 12345; //TODO: matrikelnummer lesen

  if (!userMatrikelnummer) {
    return <Navigate to="/login" />;
  }

  if (isNaN(todoId) || todoId < 0) {
    return ErrorPage("Ungültige Todo-ID")
  }

  //Todo vom Server holen
  const userTodo = dummyTodos.find((todo) => todo.id === todoId)!;
  const [todo, setTodo] = useState<Todo>(userTodo);

  //TODO: Todo nicht gefunden => return ErrorPage

  const [isEditModus, setEditModus] = useState<boolean>(false);

  const toggleTaskErledigt = (taskId: number) => {
    setTodo(prevTodo => ({
      ...prevTodo,
      aufgaben: prevTodo.aufgaben.map((task) =>
        task.id === taskId ? { ...task, erledigt: !task.erledigt } : task
      )
    }));
    // TODO: Daten speichern
  };

  const updateTitel = (taskId: number, newTitel: string) => {
    setTodo(prevTodo => ({
      ...prevTodo,
      aufgaben: prevTodo.aufgaben.map((task) =>
        task.id === taskId ? { ...task, titel: newTitel } : task
      )
    }));
  }

  const deleteTask = (taskId: number) => {
    setTodo(prevTodo => ({
      ...prevTodo,
      aufgaben: prevTodo.aufgaben.filter((task) => task.id != taskId)
    }));
  }

  const updateTodo = (todo: Todo) => {
    setEditModus(false);

    //TODO: Todo in DB aktualisieren
  }


  return (
    <Layout backURL={"/todo"}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <H2 className="py-2">{todo.titel}</H2>
          <p>{todo.text}</p>
        </div>
        {!isEditModus ?
          (<IconButton
            outerClassName="bg-primary p-3 rounded-xl"
            Icon={Pencil}
            onClick={() => setEditModus(true)}
          />) :
          (<IconButton
            outerClassName="bg-primary p-3 rounded-xl"
            Icon={Save}
            onClick={() => updateTodo(todo)}
          />)}

      </div>
      {!todo.aufgaben || todo.aufgaben.length === 0 ? (
        <p>Keine Tasks gefunden</p>
      ) : (
        <ul>
          {todo.aufgaben.map((task) => (
            <li key={task.id} className="grid grid-cols-[1fr_auto]" >
              {!isEditModus ? (
                <>
                  <span className={task.erledigt ? "line-through" : ""}>
                    {task.titel}
                  </span>
                  <label>
                    <input
                      type="checkbox"
                      checked={task.erledigt}
                      onChange={() => toggleTaskErledigt(task.id)}
                      className="w-6 h-6 rounded-full border-2"
                    />
                  </label>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    className="bg-white rounded-2xl border p-1 mr-4"
                    value={task.titel}
                    onChange={(e) => updateTitel(task.id, e.target.value)} />
                  <button onClick={() => deleteTask(task.id)}>
                    🗑️
                  </button>
                </>
              )
              }
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}

function ErrorPage(text: string) {
  return (
    <>
      <h1>Error</h1>
      <p>{text}</p>
    </>
  )
}