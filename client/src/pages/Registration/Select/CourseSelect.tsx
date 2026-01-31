import { ButtonPrimary } from "../../../components/Buttons";
import { usePrograms } from "./usePrograms";

export function CourseSelect({
  step,
  isbachelor,
  onCourse,
  onVersion,
  selectedProgramId,
}: {
  step: number;
  isbachelor: boolean;
  onCourse: (str: string) => void;
  onVersion: (str: string) => void;
  selectedProgramId?: string;
}) {
  const programs = usePrograms().filter((a) => a.isbachelor == isbachelor);

  if (step === 1) {
    return (
      <div className="flex flex-col gap-4">
        {programs.map((prog) => (
          <ButtonPrimary key={prog.id} onClick={() => onCourse(prog.id)}>
            {prog.name}
          </ButtonPrimary>
        ))}
      </div>
    );
  }

  if (step === 2) {
    const selectedProgram = programs.find((p) => p.id === selectedProgramId);
    if (!selectedProgram) return <p>Kein Programm ausgewählt</p>;

    return (
      <div className="flex flex-col gap-4">
        {selectedProgram.versions.map((ver) => (
          <ButtonPrimary key={ver} onClick={() => onVersion(ver)}>
            {ver}
          </ButtonPrimary>
        ))}
      </div>
    );
  }

  return null;
}