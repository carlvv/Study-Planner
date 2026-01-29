type HeadlinesProps = {
  children: React.ReactNode;
  className?: string;
};

function H1({ children, className: classname }: HeadlinesProps) {
  if (!classname) classname = "";
  return (
    <h1 className={"lg:text-4xl text-3xl  " + classname}>
      {children}
    </h1>
  );
}

function H2({ children, className: classname }: HeadlinesProps) {
  if (!classname) classname = "";
  return (
    <h2 className={"lg:text-3xl text-2xl " + classname}>
      {children}
    </h2>
  );
}

function H3({ children, className: classname }: HeadlinesProps) {
  if (!classname) classname = "";
  return (
    <h3 className={"lg:text-2xl text-xl " + classname}>
      {children}
    </h3>
  );
}

function H4({ children, className: classname }: HeadlinesProps) {
  if (!classname) classname = "";
  return (
    <h4 className={"lg:text-xl text-lg font-normal " + classname}>
      {children}
    </h4>
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

export { P, H1, H2, H3, H4, SubHeadline };
