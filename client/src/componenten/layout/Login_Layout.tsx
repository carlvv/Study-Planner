import { H2, H4 } from "../Headlines";

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
        <img
          src="https://scontent-ham3-1.xx.fbcdn.net/v/t39.30808-1/326391977_5996287837084498_964917462734101031_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=102&ccb=1-7&_nc_sid=f907e8&_nc_ohc=kNgHZWwC5qgQ7kNvwHFRWA2&_nc_oc=AdnYCeCKuqViYHu6sh6w957csH8wQm25_OYT7NaPSulo-fqtQ2rFVFZKRk-vESEavOaJ2orJzKpP_2Oxtoh_ELpv&_nc_zt=24&_nc_ht=scontent-ham3-1.xx&_nc_gid=VAlEI75RnHIja_kdkimTnQ&oh=00_AflAg-lZF2iiq9eVEgcqZXKNCiLXmVWyadgjHmvZKqnhAQ&oe=69573020"
          alt="FH Wedel Logo"
        />
      </a>
      <H2>FH Wedel</H2>
    </header>
  );
}

export default LoginLayout;
