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

  //Speichert in welchem Modus der User ist
  const [isEditModus, setEditModus] = useState<boolean>(false);
  //Speichert den Titel einer neuen Task
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  //Speichert den neuen Titel des Todos
  const [newTodoTitle, setNewTodoTitle] = useState<string>(todo.titel);
  //Speichert die neue Todo Beschreibung
  const [newTodoDescription, setNewTodoDescription] = useState<string>(todo.text);

  /**
   * Toggled den Wert "erledigt" einer Task
   * 
   * @param taskId Task-Id, dessen Wert getoggled werden soll
   */
  const toggleTaskErledigt = (taskId: number) => {
    setTodo(prevTodo => ({
      ...prevTodo,
      aufgaben: prevTodo.aufgaben.map((task) =>
        task.id === taskId ? { ...task, erledigt: !task.erledigt } : task
      )
    }));
    // TODO: Daten speichern
  };

  /**
   * Aktualisiert den Titel einer Task
   * 
   * @param taskId Task, dessen Titel aktualisiert werden soll
   * @param newTitel neuer Titel
   */
  const updateTitel = (taskId: number, newTitel: string) => {
    setTodo(prevTodo => ({
      ...prevTodo,
      aufgaben: prevTodo.aufgaben.map((task) =>
        task.id === taskId ? { ...task, titel: newTitel } : task
      )
    }));
  }

  /**
   * Löscht eine Task
   * 
   * @param taskId Task, die gelöscht werden soll
   */
  const deleteTask = (taskId: number) => {
    setTodo(prevTodo => ({
      ...prevTodo,
      aufgaben: prevTodo.aufgaben.filter((task) => task.id !== taskId)
    }));
  }

  /**
   * Speichert die Änderung am Todo auf dem Server
   * 
   * @param todo Todo, welches aktualisiert werden soll
   */
  const updateTodo = (todo: Todo) => {
    setEditModus(false);
    setTodo(prevTodo => ({
      ...prevTodo,
      titel: newTodoTitle,
      text: newTodoDescription
    }))

    //TODO: Todo in DB aktualisieren
  }

  //TODO: vom Backend eindeutig ID geben lassen und abspeichern
  const addTask = (titel: string) => {
    setTodo(prevTodo => ({
      ...prevTodo,
      aufgaben: [...prevTodo.aufgaben, { id: Date.now(), titel: titel, erledigt: false }]
    }));

    setNewTaskTitle("")
  }


  return (
    <Layout backURL={"/todo"}>
      <div className="flex justify-between items-center mb-8">
        <div>
          {!isEditModus ? (
            <>
              <H2 className="py-2">{todo.titel}</H2>
              <p>{todo.text}</p>
            </>
          ) : (
            <>
              <input type="text"  value={newTodoTitle} className="block w-full lg:text-3xl text-2xl bg-white rounded-2xl border p-1" onChange={(e) => setNewTodoTitle(e.target.value)} />
              <input type="text" value={newTodoDescription} className="block w-full bg-white rounded-2xl border p-1" onChange={(e) => setNewTodoDescription(e.target.value)} />
            </>
          )}

        </div>
        {!isEditModus ?
          (<IconButton
            outerClassName="bg-primary p-3 rounded-xl  text-white"
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
        <>
        {!isEditModus && (<p>Keine Tasks gefunden</p>)}
        </>
      ) : (
        <ul>
          {todo.aufgaben.map((task) => (
            <li key={task.id} className="grid grid-cols-[1fr_3em]" >
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
                    className="bg-white rounded-2xl border p-1"
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
      {isEditModus && (
            <li className="grid grid-cols-[1fr_3em]">
              <input
                type="text"
                className="bg-white rounded-2xl border p-1"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)} />
              <button onClick={() => addTask(newTaskTitle)}>
                +
              </button>
            </li>
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