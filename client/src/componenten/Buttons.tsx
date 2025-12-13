import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

function ButtonPrimary({
  to,
  onClick = undefined,
  children,
}: {
  to: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link to={to}>
      <button
        className="min-w-64 bg-primary dark:bg-primary-dark text-white text-lg text-bold p-4 rounded-xl hover:bg-secondary transition-colors"
        onClick={onClick}
      >
        {children}
      </button>
    </Link>
  );
}

function IconButton({
  to = "",
  Icon,
  size = 30,
  className = "",
  outerClassName = "",
  onClick = undefined,
}: {
  to?: string;
  Icon: LucideIcon;
  size?: number;
  className?: string;
  outerClassName?: string;
  onClick?: () => void;
}) {
  return (
    <Link to={to} className={outerClassName}>
      <Icon
        className={className + "text-white"}
        size={size}
        onClick={onClick}
      />
    </Link>
  );
}

function IconLink({
  to,
  Icon,
  size = 30,
  className = "",
}: {
  to: string;
  Icon: LucideIcon;
  size?: number;
  className?: string;
}) {
  return (
    <Link to={to}>
      <Icon
        className={"hover:text-black hover:text-blue " + className}
        size={size}
      />
    </Link>
  );
}


export { ButtonPrimary, IconButton, IconLink };