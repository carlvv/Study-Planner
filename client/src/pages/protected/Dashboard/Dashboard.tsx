import { Link } from "react-router-dom";
import { Card, CardWrapper } from "../../../components/Card/Card";
import { Loading } from "../../../components/Loading";
import { H1, H2, H3, P } from "../../../components/Text";
import { FlexibleColumnWrapper } from "../../../components/layout/FlexibleColumnWrapper";
import Layout from "../../../components/layout/Layout";
import { TwoColumnWrapper } from "../../../components/layout/TwoColumnWrapper";
import { WeeklyDiagramm } from "./WeeklyDiagramm";
import { useDashboard } from "./useDashboard";


export function displayTotalTime(value: number) {
  value = Math.round(value);
  if (value < 60) {
    return value + "min";
  }
  const hours = Math.floor(value / 60); // ganze Stunden
  const min = value % 60; // verbleibende Minuten

  return `${hours}h ${min}min`;
}


function displayTitle(name: any) {
  if (name instanceof String) {
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
  }

  return name;
}

export function Statistics() {
  const { data, isError, error, isLoading } = useDashboard()

  if (isError) {
    <Loading isLoading={isError} message={error.message} />
  }
  if (isLoading || !data) {
    return <Loading isLoading message={"Daten werden geladen..."} />
  }
  const { avg, daily, total, weekly } = data.stats

  return (
    <Layout backURL={"/"}>
      <H1 className="pt-4">Study Statistik</H1>
      <TwoColumnWrapper>
        <Card title={displayTotalTime(daily)} text="Heute gelernt" />
        <Card title={displayTotalTime(weekly)} text="Diese Woche gelernt" />
        <Card title={displayTotalTime(avg)} text="Durchschnitt Tag" />
        <Card title={((total / 60) / 30).toFixed(2) + " ECTS"} text="Gelernte ECTS" />
      </TwoColumnWrapper>
      <div className="p-4" />
      {total > 0 && <CardWrapper>
        <H3 className="mb-8">Dein Lernfortschritt im Wochenverlauf</H3>
        <WeeklyDiagramm
          data={data.weeklyDistribution}
        />
      </CardWrapper>}
      {total === 0 && (
        <Link to="/timer" className="block">
          <H3 className="text-center text-blue-500 bg-blue-200 md:p-16 sm:p-8 p-4  border-2 rounded-2xl 
                   hover:bg-gray-300 hover:text-gray-700 transition-all cursor-pointer">
            Bitte trage zuerst deine Lernzeiten ein, um hier Daten zu sehen. <br />
            Klicke hier, um Lernzeiten einzutragen.
          </H3>
        </Link>
      )}


      {total > 0 && <>
        <H2 className="mt-8">Modul Statistiken</H2>
        <FlexibleColumnWrapper>
          {data.modules.map((a) => (
            <CardWrapper key={a.name + a.sessionCount}>
              <h1 className="font-semibold text-xl w-50 text-wrap">
                {displayTitle(a.name)}
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
                <P>{new Date(a.last_session).toLocaleDateString()}</P>
              </div>
            </CardWrapper>
          ))}
        </FlexibleColumnWrapper>
      </>}

    </Layout>
  );
}
