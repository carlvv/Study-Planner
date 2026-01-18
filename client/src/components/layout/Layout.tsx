import { ArrowLeft } from "lucide-react";
import { IconLink } from "../Buttons";

function Layout({
  children,
  backURL: to = "/",
}: {
  children: React.ReactNode;
  backURL: string;
}) {
  return (
    <div className="h-screen p-8">
      <main className="flex flex-col w-full m-auto  md:max-w-[960px] ">
        <IconLink to={to} Icon={ArrowLeft} />
        <br />
        {children}
      </main>
    </div>
  );
}
export default Layout;
