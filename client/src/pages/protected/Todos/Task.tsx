import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Pencil, Save, Trash2 } from "lucide-react";
import type { Task, Todo } from "../../../types";
import Layout from "../../../components/layout/Layout";
import { IconButton } from "../../../components/Buttons";
import { useTask } from "./useTask";

export default function Tasks() {
  const params = useParams<{ todoId: string }>();

  const { todo, isLoading, update, deleteTodo, isError, error } = useTask(params.todoId ?? "")

  const navigate = useNavigate()

  //Speichert in welchem Modus der User ist
  const [isEditModus, setEditModus] = useState<boolean>(false);
  //Speichert den Text im Task-Textarea
  const [taskTextArea, setTaskTextArea] = useState<string>("");
  //Speichert den Text für den Titel des Todos

  const [title, setTitle] = useState<string>("")
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (!isLoading) {
      setTitle(todo?.titel!)
      setText(todo?.text!)
    }
  }, [isLoading])

  if (isLoading) {
    return <>Loading...</>
  }
  if (isError || !todo) {
    return <>{error?.message}</>
  }

  /**
   * Speichert die Änderung am Todo auf dem Server
   * 
   * @param todo Todo, welches aktualisiert werden soll
   */
  const updateTodo = () => {
    const newTasks: Task[] = taskTextArea.split("\n").map(line => line.trim()).filter(line => line !== "").map((task, index) => ({ id: index, titel: task, erledigt: false } as Task))

    const finalTitle: string = title.trim() === "" ? todo.titel : title.trim()

    // senden
    update({ title: finalTitle, desc: text, aufgaben: newTasks })

    setEditModus(!isEditModus)
  }

  function toggleTaskErledigt(id: number): void {
    let currentTodo: Todo = todo!
    console.log(currentTodo, id)
    currentTodo.aufgaben[id].erledigt = !currentTodo.aufgaben[id].erledigt
    update({ title: title, desc: text, aufgaben: currentTodo.aufgaben })
  }

  return (
    <Layout backURL={"/todo"}>
      <div className="flex justify-between items-start mb-8 gap-4">
        <div className="flex-1">
          {!isEditModus ? (
            /* Normal-Modus: Header */
            <div className="space-y-1">
              <div className="lg:text-3xl text-2xl font-bold p-3 border border-transparent">
                {title}
              </div>
              <div className="text-base text-gray-600 p-3 border border-transparent">
                {text}
              </div>
            </div>
          ) : (
            /* Edit-Modus: Header */
            <div className="space-y-1">
              <input
                type="text"
                value={title}
                className="block w-full lg:text-3xl text-2xl font-bold bg-white rounded-2xl border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                value={text}
                className="block w-full text-base bg-white rounded-2xl border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Button-Logik bleibt gleich */}
        {isEditModus && (
          <IconButton
            className="ml-auto bg-gray-800 rounded-xl p-4  text-white"
            size={60}
            Icon={Trash2}
            onClick={async () => {await deleteTodo(); navigate("/todo")}}
          />)}
        <IconButton
          className="ml-auto bg-gray-800 rounded-xl p-4  text-white"
          size={60}
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