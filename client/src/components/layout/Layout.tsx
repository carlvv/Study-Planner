import { ArrowLeft } from "lucide-react";
import { IconLink } from "../Buttons";

function Layout({
  children,
  backURL,
}: {
  children: React.ReactNode;
  backURL?: string;
}) {
  return (
    <div className="h-screen p-8">
      <main className="flex flex-col w-full m-auto  md:max-w-240 ">
        {backURL && <IconLink to={backURL} Icon={ArrowLeft} />}
        <div className="p-4"/>
        {children}
      </main>
    </div>
  );
}
export default Layout;
