import { Card, CardWrapper } from "../../../components/Card/Card";
import { H1, H2, H3, P } from "../../../components/Text";
import { FlexibleColumnWrapper } from "../../../components/layout/FlexibleColumnWrapper";
import Layout from "../../../components/layout/Layout";
import { TwoColumnWrapper } from "../../../components/layout/TwoColumnWrapper";
import { WeeklyDiagramm } from "./WeeklyDiagramm";

interface ModuleStatistic {
  title: string;
  totalTime: number;
  sessionCount: number;
  last_session: Date;
}

const statistics: ModuleStatistic[] = [
  {
    title: "Analysis",
    sessionCount: 19,
    last_session: new Date(2026, 11, 18),
    totalTime: 4030,
  },
  {
    title: "Einführung in der Betriebswirschaftslehre",
    sessionCount: 39,
    last_session: new Date(2026, 11, 20),
    totalTime: 2003,
  },
  {
    title: "Technologien der Mediengestaltung und GUI Programmierung",
    sessionCount: 19,
    last_session: new Date(2026, 11, 31),
    totalTime: 10422,
  },
];

export function displayTotalTime(value: number) {
  value = Math.round(value);
  if (value < 60) {
    return value + "min";
  }
  const hours = (value / 60).toFixed(0);
  const min = (value % 60).toFixed(0);

  return `${hours}h ${min}min`;
}

function displayTitle(name: string) {
  if (name.length > 15) {
    return name
      .split(" ")
      .reduce((acc, v) => {
        if (v.length < 4) {
          return acc + v + " ";
        }
        return acc + v.substring(0, 5) + ". ";
      }, "")
      .trim();
  }
  return name;
}

export function Statistics() {
  return (
    <Layout backURL={"/"}>
      <H1 className="pt-4">Study Statistik</H1>
      <TwoColumnWrapper>
        <Card title={displayTotalTime(104)} text="Heute gelernt" />
        <Card title={displayTotalTime(355)} text="Diese Woche gelernt" />
        <Card title={displayTotalTime(45)} text="Durchschnitt Tag" />
        <Card title="25 ECTS" text="Gewählte Module" />
      </TwoColumnWrapper>
      <div className="p-4"></div>
      <CardWrapper>
        <H3 className="mb-8">Dein Lernfortschritt im Wochenverlauf</H3>
        <WeeklyDiagramm
          data={{
            Montag: 110,
            Dienstag: 150,
            Mittwoch: 110,
            Donnerstag: 24,
            Freitag: 180,
            Samstag: 75,
            Sonntag: 15,
          }}
        />
      </CardWrapper>
      <H2 className="mt-8">Modul Statistiken</H2>
      <FlexibleColumnWrapper>
        {statistics.map((a) => (
          <CardWrapper>
            <h1 className="font-semibold text-xl w-50 text-wrap">
              {displayTitle(a.title)}
            </h1>
            <div className="flex justify-between w-full">
              <p className="text-gray-500 text-sm">Gesamtzeit</p>
              <P>{displayTotalTime(a.totalTime)}</P>
            </div>
            <div className="flex justify-between w-full">
              <p className="text-gray-500 text-sm">Anzahl Session</p>
              <P>{a.sessionCount}</P>
            </div>
            <div className="flex justify-between w-full">
              <p className="text-gray-500 text-sm">Dauer pro Session</p>
              <P>{displayTotalTime(a.totalTime / a.sessionCount)}</P>
            </div>
            <div className="flex justify-between w-full">
              <p className="text-gray-500 text-sm">Gesamtzeit</p>
              <P>{a.last_session.toLocaleDateString()}</P>
            </div>
          </CardWrapper>
        ))}
      </FlexibleColumnWrapper>
    </Layout>
  );
}
