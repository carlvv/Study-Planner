import { IconLink } from "../../components/Buttons";
import { ArrowLeft } from "lucide-react";
import { LoginLayout } from "../../components/layout/Login_Layout";
import { UserForm } from "./UserForm";
import { useState } from "react";
import type { Curricula } from "../../types";
import { useStep } from "./useStep";
import { DegreeSelect } from "./Select/DegreeSelect";
import { CourseSelect } from "./Select/CourseSelect";

export default function Registration() {
  const { step, nextStep, prevStep } = useStep();
  const [curriculaData, setCurriculaData] = useState<Curricula>({
    isBachelor: true,
    program_name: "",
    program_version: "",
  });

  function updateCurricula(key: string, value: any) {
    setCurriculaData((prev) => ({
      ...prev,
      [key]: value,
    }));
    nextStep();
  }

  const headlines = [
    "Was studieren Sie?",
    `Welchen ${curriculaData.isBachelor ? "Bachelor" : "Master"} Studiengang?`,
    "Wählen Sie ihre Studienordnung aus.",
    "Bitte füllen Sie das Formular aus.",
  ];

  return (
    <LoginLayout
      subtext={
        <>
          <IconLink to={step == 0 ? "/" : prevStep} Icon={ArrowLeft} />
          <p>{headlines[step]}</p>
        </>
      }
    >
      {step == 0 ? (
        <DegreeSelect
          selectBachelor={() => updateCurricula("isBachelor", true)}
          selectMaster={() => updateCurricula("isBachelor", false)}
        />
      ) : step < 3 ? (
        <CourseSelect
          step={step}
          isbachelor={curriculaData.isBachelor}
          selectedProgramId={curriculaData.program_name}
          onCourse={(id) => updateCurricula("program_name", id)}
          onVersion={(ver) => updateCurricula("program_version", ver)}
        />
      ) : (
        <UserForm curriculaData={curriculaData} />
      )}
    </LoginLayout>
  );
}
