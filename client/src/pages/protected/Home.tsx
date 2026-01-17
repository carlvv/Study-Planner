import { Link } from "react-router-dom";
import { FHLogo, MyCampusLogo } from "../../components/Logos";
import useAuth from "../../context/useAuth";
import { useEffect, useState, type ReactNode } from "react";
import { Calendar, Clock, LayoutGrid, List, Map } from "lucide-react";
import { fetch_backend_auth } from "../../helper";
import { TwoColumnWrapper } from "../../components/layout/TwoColumnWrapper";

interface TileProps {
  icon: ReactNode;
  to: string;
  title: string;
  subtitle?: string;
  color: string; // Tailwind bg color
}

function Header({ name }: { name: string | undefined }) {
  const { logout } = useAuth();
  return (
    <header className="flex w-full justify-between">
      <div className="flex flex-col gap-1 h-fit">
        <p>{name}</p>
        <Link className=" text-red-600" to="/welcome" onClick={() => logout()}>
          Abmelden
        </Link>
        <Link className="link" to="/profile">
          Profile
        </Link>
      </div>
      <div>
        <FHLogo />
      </div>
    </header>
  );
}

function Tile({ icon, to, title, subtitle, color }: TileProps) {
  return (
    <Link
      to={to}
      className={`flex flex-col justify-between rounded-2xl p-4 ${color}
        w-full h-[120px] hover:opacity-90 transition`}
    >
      <div className="text-3xl">{icon}</div>

      <div>
        <p className="font-semibold leading-tight">{title}</p>
        {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
      </div>
    </Link>
  );
}

const TILE_CONFIG = [
  {
    icon: <Clock size={40} />,
    to: "/time",
    title: "Track Time",
    color: "bg-indigo-500 text-white",
    key: "time",
  },
  {
    icon: <List size={40} />,
    to: "/todo",
    title: "Tasks",
    color: "bg-lime-400 text-black",
    key: "tasks",
  },
  {
    icon: <Calendar size={40} />,
    to: "/schedule",
    title: "Studenplan",
    color: "bg-pink-700 text-white",
    key: "schedule",
  },
  {
    icon: <Map size={40} />,
    to: "/curricula",
    title: "Curricula",
    color: "bg-green-700 text-white",
    key: "curricula",
  },
  {
    icon: <LayoutGrid size={40} />,
    to: "/dashboard",
    title: "Dashboard",
    color: "bg-teal-400",
    key: "dashboard",
  },
  {
    icon: <FHLogo size="40px" />,
    to: "https://lms.fh-wedel.de",
    title: "FH Moodle",
    color: "bg-white text-black border",
    key: "moodle",
  },
  {
    icon: <MyCampusLogo size="40px" />,
    to: "https://mycampus.fh-wedel.de",
    title: "myCampus",
    color: "bg-red-700 text-white",
    key: "mycampus",
  },
];

function Home() {
  const { user, loading } = useAuth();
  const [data, setData] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      console.log("11");
      
      const res = await fetch_backend_auth("/dashboard");
      const json = await res.json();
      setData(json);
    };
    loadData();
  }, []);

  if (loading) return <></>;

  return (
    <div className="h-screen p-8">
      <main className="flex flex-col w-full m-auto items-center md:max-w-[760px]">
        <div className="w-full">
          <Header name={user?.name} />
        </div>
        <TwoColumnWrapper>
          {TILE_CONFIG.map((tile) => (
            <Tile
              key={tile.key}
              icon={tile.icon}
              to={tile.to}
              title={tile.title}
              subtitle={data[tile.key]}
              color={tile.color}
            />
          ))}
        </TwoColumnWrapper>
      </main>
    </div>
  );
}

export default Home;
