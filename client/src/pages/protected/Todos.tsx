import { useState } from "react";
import { Navigate } from "react-router-dom";
import type { Todo } from "../../types";
import { dummyTodos } from "../../data/todos";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { H2 } from "../../components/Headlines";
import { IconButton } from "../../components/Buttons";
import { Plus } from "lucide-react";

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
    <Layout backURL={"/"}>
      <div className="flex justify-between items-center mb-8">
        <H2 classname="py-6">{"Todos"}</H2>
        <IconButton outerClassName="bg-primary p-3 rounded-xl" Icon={Plus} />
      </div>

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
    </Layout>
  );
}
