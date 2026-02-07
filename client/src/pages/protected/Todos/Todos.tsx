import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { Plus } from "lucide-react";
import type { Todo } from "../../../types";
import { H1 } from "../../../components/Text";
import { IconButton } from "../../../components/Buttons";
import Layout from "../../../components/layout/Layout";
import { FlexibleColumnWrapper } from "../../../components/layout/FlexibleColumnWrapper";
import { useTodos } from "./useTodos";
import { Loading } from "../../../components/Loading";

export default function Todos() {
  const { todos, addTodo, isLoading } = useTodos()

  //Zum Einblenden des Forms für ein neues Todo
  const [useForm, setUseForm] = useState<boolean>(false);
  //Zum Einblenden eines Fehlertextes falls kein Titel gesetzt wurde
  const [errorNoTitle, setErrorNoTitle] = useState<boolean>(false)
  //Zum Speichern der Werte eines neuen Todos
  const [newTodo, setNewTodo] = useState<Todo>({ id: -1, text: "", titel: "", aufgaben: [] });
  //Zum automatischen Scrollen zum Form für neue Todos
  const formRef = useRef<HTMLDivElement>(null);

  // scrollen sobald useForm true wird
  useEffect(() => {
    if (useForm) {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [useForm]);

  //Speichert ein neues Todo in die Datenbank
  const handleNewTodo = () => {
    //gültiger Titel?
    if (newTodo.titel.trim() === "") {
      setErrorNoTitle(true);
      return;
    }

    addTodo({ title: newTodo.titel,  desc: newTodo.text})

    //Reset
    setUseForm(false);
    setErrorNoTitle(false);
    setNewTodo((prev) => ({ ...prev, text: "", titel: "" }))
  }

  if (isLoading) {
    return <Loading isLoading={isLoading} />
  }


  //TODO: nur Todos des eingelogten Users aud DB holen
  // Nur Todos des eingeloggten Users


  return (
    <Layout backURL={"/"}>
      <div className="flex justify-between items-center mb-8 ">
        <H1 className="py-6">{"Todos"}</H1>
        <IconButton onClick={() => setUseForm(true)} outerClassName="bg-primary p-3 rounded-xl hover:bg-secondary  text-white" Icon={Plus} />
      </div>

      {todos.length === 0 ? (
        <p>Keine offene Todos</p>
      ) : (
        <FlexibleColumnWrapper>
          {todos.map((todo) => (
            <div key={todo.id} className="bg-white rounded-lg shadow p-4">
              <Link to={`/todo/${todo.id}`}>
                <h2 className="text-xl font-bold mb-2">{todo.titel}</h2>

                <p className="text-gray-700 mb-4">
                  {todo.text}
                </p>

                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  {todo.aufgaben.slice(0, 2).map((task) => (
                    <li className={task.erledigt ? "line-through" : ""}>{task.titel}</li>
                  ))}
                  {todo.aufgaben.length > 2 && (<li>...</li>)}
                </ul>
              </Link>
            </div>
          ))}
        </FlexibleColumnWrapper>
      )}
      {/* Bereich um neues Todo zu erstellen */}
      {useForm && (
        <div ref={formRef} className="bg-white rounded-lg shadow p-4 w-125 mt-8">
          <div className="flex items-center mb-4">
            <label className="text-xl font-bold mr-2 w-30">Titel:</label>
            <input onChange={(e) => setNewTodo((prev) => ({ ...prev, titel: e.target.value }))} type="text" style={{ backgroundColor: "#EEEEEE" }} className="border-black border rounded-lg text-xl flex-1 max-w-xs min-w-1 pl-1"></input>
          </div>

          <div className="flex items-center mb-4">
            <label className="list-disc space-y-1 mr-2 w-30">Beschreibung:</label>
            <input onChange={(e) => setNewTodo((prev) => ({ ...prev, text: e.target.value }))} type="text" style={{ backgroundColor: "#EEEEEE" }} className="border-black border rounded-lg text-md flex-1 max-w-xs min-w-1 pl-1"></input>
          </div>
          <div className="flex flex-col justify-center items-center p-4">
            {errorNoTitle && (<p className="text-red-500">Titel darf nicht leer sein</p>)}
            <button onClick={handleNewTodo} className=" bg-primary text-gray-50 px-6 py-2 rounded-lg hover:bg-secondary">Todo erstellen</button>
          </div>
        </div>
      )}

    </Layout>
  );
}
