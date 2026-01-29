import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ButtonPrimaryParams {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disable? : boolean
}

function ButtonPrimary({ to, onClick, children, disable = false }: ButtonPrimaryParams) {
  const button = (
    <button
      className="min-w-64 bg-primary  text-white text-lg font-bold p-4 rounded-xl hover:bg-secondary transition-colors disabled:bg-gray-600"
      onClick={onClick}
      disabled={disable}
    >
      {children}
    </button>
  );

  if (to) {
    return <Link to={to}>{button}</Link>;
  }

  return button;
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
  to: string | (() => void);
  Icon: LucideIcon;
  size?: number;
  className?: string;
}) {
  if (typeof to !== "string") {
    return (
      <Icon
        className={"hover:text-black hover:text-blue " + className}
        size={size}
        onClick={to}
      />
    );
  }

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
