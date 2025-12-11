import { Link } from "react-router-dom";

function Button_Primary({
  children,
  to,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link to={to}>
      <button className=" bg-primary dark:bg-primary-dark text-white text-lg text-bold p-4 rounded-xl hover:bg-secondary transition-colors">
        {children}
      </button>
    </Link>
  );
}

function Button_Primary_Action({
  children,
  onClick,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className=" bg-primary dark:bg-primary-dark text-white text-lg text-bold p-4 rounded-xl hover:bg-secondary transition-colors"
    >
      {children}
    </button>
  );
}

export { Button_Primary, Button_Primary_Action };
