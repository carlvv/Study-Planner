import { ButtonPrimary, IconLink } from "../../components/Buttons";
import { ArrowLeft } from "lucide-react";
import { LoginLayout } from "../../components/layout/Login_Layout";
import TextInput from "../../components/Input";
import { useRegistration } from "./useRegistration";

function DegreeSelect({
  selectBachelor,
  selectMaster,
}: {
  selectBachelor: () => void;
  selectMaster: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 items-center">
      <ButtonPrimary onClick={selectBachelor}>Bachelor</ButtonPrimary>
      <p className="text-gray-500">oder</p>
      <ButtonPrimary onClick={selectMaster}>Master</ButtonPrimary>
    </div>
  );
}

function CourseSelect({
  courses,
  onClick,
}: {
  courses: string[];
  onClick: (str: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {courses.map((name, index) => (
        <ButtonPrimary key={index} onClick={() => onClick(name)}>
          {name}
        </ButtonPrimary>
      ))}
    </div>
  );
}

export default function Registration() {
  const {
    headlines,
    names,
    versions,
    data,
    updateForm,
    updateCurricula,
    step,
    prevStep,
    error,
    handleSubmit,
  } = useRegistration();

  function renderStep(step: number) {
    switch (step) {
      case 0:
        return (
          <DegreeSelect
            selectBachelor={() => updateCurricula("isBachelor", true)}
            selectMaster={() => updateCurricula("isBachelor", false)}
          />
        );

      case 1:
        return (
          <CourseSelect
            courses={names}
            onClick={(str) => updateCurricula("program_name", str)}
          />
        );

      case 2:
        return (
          <CourseSelect
            courses={versions}
            onClick={(str) => updateCurricula("program_version", str)}
          />
        );

      case 3:
        return (
          <div className="flex flex-col gap-3 w-full">
            <TextInput
              label="Dein vollständiger Name"
              value={data.name}
              error={error.name}
              placeholder="Max Mustermann"
              onChange={(e) => updateForm("name", e)}
            />
            <TextInput
              label="Dein Start-Semester:"
              value={data.start_semester}
              error={error.start_semester}
              placeholder="WS25"
              name="semester"
              onChange={(e) => updateForm("start_semester", e)}
            />
            <TextInput
              label="Deine Matrikelnummer"
              value={data.student_id}
              error={error.student_id}
              placeholder="10000"
              name="username"
              onChange={(e) => updateForm("student_id", e)}
            />
            <TextInput
              label="Dein Passwort"
              value={data.password}
              error={error.password}
              placeholder="******"
              type="password"
              onChange={(e) => updateForm("password", e)}
            />
            <TextInput
              label="Dein Passwort bestätigen"
              value={data.password_confirm}
              error={error.password_confirm}
              placeholder="******"
              type="password"
              onChange={(e) => updateForm("password_confirm", e)}
            />
            <ButtonPrimary onClick={handleSubmit}>Absenden</ButtonPrimary>
          </div>
        );

      default:
        return <></>;
    }
  }

  return (
    <LoginLayout
      subtext={
        <>
          <IconLink to={step == 0 ? "/" : prevStep} Icon={ArrowLeft} />
          <p>{headlines[step]}</p>
        </>
      }
    >
      {renderStep(step)}
    </LoginLayout>
  );
}
