import { H2, H4 } from "./Headlines";

function LoginLayout({
  subtext,
  children,
}: {
  subtext: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 h-screen ">
      <main className="lg:col-span-6 col-span-12 flex flex-col w-fit m-auto items-center gap-18 ">
        <Header />
        <H4>{subtext}</H4>
        <div className="flex flex-col items-center gap-8">{children}</div>
      </main>
      <aside className="hidden lg:flex col-span-6 bg-amber-600  items-center">
        {/* Hier könnte ein Bild oder eine Grafik eingefügt werden */}
      </aside>
    </div>
  );
}

function Header() {
  return (
    <header className="flex justify-center items-center gap-4">
      <a className="size-16" href="https://fh-wedel.de">
        <img src="" alt="FH Wedel Logo" />
      </a>
      <H2>FH Wedel</H2>
    </header>
  );
}

export default LoginLayout;
