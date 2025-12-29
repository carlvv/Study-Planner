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
      <main className="flex flex-col w-full m-auto  md:max-w-[760px]">
        <IconLink to={to} Icon={ArrowLeft} />
        {children}
      </main>
      <footer className="p-4 bg-white dark:bg-gray-800 text-center">
        &copy; {new Date().getFullYear()} Study Planner
      </footer>
    </div>
  );
}
export default Layout;
