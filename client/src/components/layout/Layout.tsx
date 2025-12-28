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
    <div className="p-6 min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark flex flex-col">
      <IconLink to={to} Icon={ArrowLeft} />
      <main className="flex-1 p-4">{children}</main>
      <footer className="p-4 bg-white dark:bg-gray-800 text-center">
        &copy; {new Date().getFullYear()} Study Planner
      </footer>
    </div>
  );
}
export default Layout;
