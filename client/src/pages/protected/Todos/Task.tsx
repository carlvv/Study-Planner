import { useState } from "react";
import { Navigate } from "react-router-dom";

import { useParams } from "react-router-dom";

import { Pencil, Plus, Save } from "lucide-react";
import type { Todo, Task } from "../../../types";
import { dummyTodos } from "../../../data/todos";
import Layout from "../../../components/layout/Layout";
import { H2 } from "../../../components/Text";
import { IconButton } from "../../../components/Buttons";

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
  //Speichert den Text im Task-Textarea
  const [taskTextArea, setTaskTextArea] = useState<string>("");
  //Speichert den Text für den Titel des Todos
  const [todoTitle, setTodoTitle] = useState<string>(todo.titel);

  const setNewTodoText = (newText: string) => {
    setTodo(prevTodo => ({
      ...prevTodo,
      text: newText.trim()
    }))
  }

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
   * Speichert die Änderung am Todo auf dem Server
   * 
   * @param todo Todo, welches aktualisiert werden soll
   */
  const updateTodo = () => {
    //Tasks speichern
    const newTasks: Task[] = taskTextArea.split("\n").map(line => line.trim()).filter(line => line !== "").map((task, index) => ({ id: Date.now() + index, titel: task, erledigt: false } as Task))

    //alten Titel nehmen falls leer
    const finalTitle: string = todoTitle.trim() === "" ? todo.titel : todoTitle.trim()

    setTodo(prevTodo => ({
      ...prevTodo,
      titel: finalTitle,
      aufgaben: newTasks
    }));

    setEditModus(false);

    //TODO: Todo in DB aktualisieren
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
              <input type="text" value={todoTitle} className="block w-full lg:text-3xl text-2xl bg-white rounded-2xl border p-2" onChange={(e) => setTodoTitle(e.target.value)} />
              <input type="text" value={todo.text} className="block w-full bg-white rounded-2xl border p-1" onChange={(e) => setNewTodoText(e.target.value)} />
            </>
          )}

        </div>
        {!isEditModus ?
          (<IconButton
            outerClassName="bg-primary p-3 rounded-xl  text-white"
            Icon={Pencil}
            onClick={() => {setEditModus(true); setTaskTextArea(todo.aufgaben.map(task => task.titel).join("\n"))}}
          />) :
          (<IconButton
            outerClassName="bg-primary p-3 rounded-xl"
            Icon={Save}
            onClick={() => updateTodo()}
          />)}

      </div>
      {isEditModus ? (
        <div className="h-screen">
          <textarea
            onChange={(e) => setTaskTextArea(e.target.value)}
            value={taskTextArea}
            rows={taskTextArea.split("\n").length}
            className="bg-white rounded-lg shadow p-1 w-full resize: none box-border border" />
        </div>
      ) : (
        <>
          {!todo.aufgaben || todo.aufgaben.length === 0 ?
            (
              <p>Dieses Todo enthält noch keine Tasks.</p>
            ) : (
              <ul>
                {todo.aufgaben.map((task) => (
                  <li key={task.id} className="grid grid-cols-[1fr_3em]">
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
                  </li>
                ))}
              </ul>
            )}
        </>
      )}

    </Layout >
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