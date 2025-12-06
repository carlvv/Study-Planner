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
      <button className="min-w-64 bg-primary dark:bg-primary-dark text-white text-lg text-bold py-4 rounded-xl hover:bg-secondary transition-colors">
        {children}
      </button>
    </Link>
  );
}

export { Button_Primary };
