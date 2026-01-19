import { H2, H3 } from "../Text";
import { FHLogo } from "../Logos";

function LoginLayout({
  subtext,
  children,
}: {
  subtext: string | React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center mb-32">
      <main className="flex flex-col w-full m-auto items-center gap-18">
        <Header />
        <H3 className="flex gap-8">{subtext}</H3>
        <div className="flex flex-col items-center gap-8 w-full p-1 max-w-87.5">
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
