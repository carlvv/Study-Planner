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
      <div className="flex justify-between items-start mb-8 gap-4">
        <div className="flex-1">
          {!isEditModus ? (
            /* Normal-Modus: Header */
            <div className="space-y-1">
              <div className="lg:text-3xl text-2xl font-bold p-3 border border-transparent">
                {todo.titel}
              </div>
              <div className="text-base text-gray-600 p-3 border border-transparent">
                {todo.text}
              </div>
            </div>
          ) : (
            /* Edit-Modus: Header */
            <div className="space-y-1">
              <input
                type="text"
                value={todoTitle}
                className="block w-full lg:text-3xl text-2xl font-bold bg-white rounded-2xl border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                onChange={(e) => setTodoTitle(e.target.value)}
              />
              <input
                type="text"
                value={todo.text}
                className="block w-full text-base bg-white rounded-2xl border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                onChange={(e) => setNewTodoText(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Button-Logik bleibt gleich */}
        <IconButton
          outerClassName="bg-primary p-4 rounded-2xl text-white shadow-lg shrink-0"
          Icon={!isEditModus ? Pencil : Save}
          onClick={() => !isEditModus ? (setEditModus(true), setTaskTextArea(todo.aufgaben.map(t => t.titel).join("\n"))) : updateTodo()}
        />
      </div>

      {/* Aufgaben-Bereich */}
      <div className="min-h-75">
        {isEditModus ? (
          <textarea
            onChange={(e) => setTaskTextArea(e.target.value)}
            value={taskTextArea}
            rows={Math.max(8, taskTextArea.split("\n").length)}
            className="block w-full text-base bg-white rounded-2xl border border-gray-200 p-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none shadow-sm"
            placeholder="Aufgaben untereinander schreiben..."
          />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            {!todo.aufgaben || todo.aufgaben.length === 0 ? (
              <p className="text-gray-400 italic">Dieses Todo enthält noch keine Tasks.</p>
            ) : (
              <ul className="space-y-3">
                {todo.aufgaben.map((task) => (
                  <li key={task.id} className="flex items-center justify-between group">
                    <span className={`text-lg ${task.erledigt ? "line-through text-gray-400" : "text-gray-700"}`}>
                      {task.titel}
                    </span>
                    <input
                      type="checkbox"
                      checked={task.erledigt}
                      onChange={() => toggleTaskErledigt(task.id)}
                      className="w-6 h-6 rounded-lg border-2 border-primary text-primary focus:ring-primary cursor-pointer"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
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