type HeadlinesProps = {
  children: React.ReactNode;
  className?: string;
};

function H1({ children, className: classname }: HeadlinesProps) {
  if (!classname) classname = "";
  return (
    <h1 className={"text-2xl md:text-3xl lg:text-4xl  " + classname}>
      {children}
    </h1>
  );
}

function H2({ children, className: classname }: HeadlinesProps) {
  if (!classname) classname = "";
  return (
    <h2 className={"text-1xl md:text-2xl lg:text-3xl " + classname}>
      {children}
    </h2>
  );
}

function H3({ children, className: classname }: HeadlinesProps) {
  if (!classname) classname = "";
  return (
    <h3 className={"text-xl md:text-xl lg:text-2xl " + classname}>
      {children}
    </h3>
  );
}

function SubHeadline({ children, className: classname }: HeadlinesProps) {
  if (!classname) classname = "";
  return (
    <h4 className={"lg:text-xl text-sm text-gray-500" + classname}>
      {children}
    </h4>
  );
}

function P({ children, className: classname }: HeadlinesProps) {
  if (!classname) classname = "";
  return (
    <p className={"text-gray-800 text-sm" + classname}>
      {children}
    </p>
  );
}

export { P, H1, H2, H3, SubHeadline };
