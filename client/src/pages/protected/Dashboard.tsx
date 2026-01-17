import { Card, CardWrapper } from "../../components/Card";
import { H1 } from "../../components/Headlines";
import Layout from "../../components/layout/Layout";
import { TwoColumnWrapper } from "../../components/layout/TwoColumnWrapper";
import { WeeklyDiagramm } from "../../components/WeeklyDiagramm";

export function Statistics() {
  return (
    <>
      <Layout backURL={"/"}>
        <H1>Study Statistik</H1>
        <TwoColumnWrapper>
          <Card title="1h 45min" text="Heute gelernt" />
          <Card title="6h 45min" text="Diese Woche gelernt" />
          <Card title="48min" text="Durchschnitt Tag" />
          <Card title="25 ECTS" text="Gewählte Module" />
        </TwoColumnWrapper>
        <br />
        <CardWrapper>
          <WeeklyDiagramm
            data={{
              Montag: 110,
              Dienstag: 120,
              Mittwoch: 90,
              Donnerstag: 240,
              Freitag: 180,
              Samstag: 75,
              Sonntag: 15,
            }}
          />
        </CardWrapper>
      </Layout>
    </>
  );
}


