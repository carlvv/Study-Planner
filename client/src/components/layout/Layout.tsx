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
    <div className="h-screen p-4">
      <main className="flex flex-col w-full m-auto py-8 md:max-w-240 ">
        {backURL && <IconLink to={backURL} Icon={ArrowLeft} />}
        {children}
      </main>
    </div>
  );
}
export default Layout;
