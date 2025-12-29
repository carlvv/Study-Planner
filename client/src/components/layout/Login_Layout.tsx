import { H2, H4 } from "../Headlines";
import { FHLogo } from "../Logos";

function LoginLayout({
  subtext,
  children,
}: {
  subtext: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen py-8">
      <main className="flex flex-col w-full m-auto items-center gap-18 ">
        <Header />
        <H4>{subtext}</H4>
        <div className="flex flex-col items-center gap-8 w-full p-1 max-w-[300px]">
          {children}
        </div>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="flex justify-center items-center gap-4">
      <a className="size-16" href="https://fh-wedel.de">
        <FHLogo />
      </a>
      <H2>FH Wedel</H2>
    </header>
  );
}

export { LoginLayout };
