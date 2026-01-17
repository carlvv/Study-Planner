type HeadlinesProps = {
  children: React.ReactNode;
  classname?: string;
};

function H1({ children, classname }: HeadlinesProps) {
  if (!classname) classname = "";
  return (
    <h1 className={"lg:text-4xl text-3xl  " + classname}>
      {children}
    </h1>
  );
}

function H2({ children, classname }: HeadlinesProps) {
  if (!classname) classname = "";
  return (
    <h2 className={"lg:text-3xl text-2xl " + classname}>
      {children}
    </h2>
  );
}

function H3({ children, classname }: HeadlinesProps) {
  if (!classname) classname = "";
  return (
    <h3 className={"lg:text-2xl text-xl " + classname}>
      {children}
    </h3>
  );
}

function H4({ children, classname }: HeadlinesProps) {
  if (!classname) classname = "";
  return (
    <h4 className={"lg:text-xl text-lg font-normal " + classname}>
      {children}
    </h4>
  );
}

function SubHeadline({ children, classname }: HeadlinesProps) {
  if (!classname) classname = "";
  return (
    <h4 className={"lg:text-xl text-gray-500" + classname}>
      {children}
    </h4>
  );
}

export { H1, H2, H3, H4, SubHeadline };
