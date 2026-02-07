import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface ButtonPrimaryParams {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disable?: boolean
  className?: string
}

function ButtonPrimary({ to, onClick, children, disable = false, className }: ButtonPrimaryParams) {
  const button = (
    <button
      className={twMerge(
        "min-w-64 bg-primary hover:bg-secondary text-white text-lg font-bold p-4 rounded-xl transition-colors disabled:bg-gray-600",
        className
      )}
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
        className={className}
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
