import { ButtonPrimary } from "../../../components/Buttons";
import { Loading } from "../../../components/Loading";
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
  const { data, isLoading } = usePrograms()


  if (isLoading) {
    return <><Loading isLoading={isLoading} /></>
  }

  const programs = isbachelor ? data!.true : data!.false

  if (step === 1) {
    const unique = [...new Set(programs.map(item => item.name))]
    return (
      <div className="flex flex-col gap-4">
        {unique.map((prog, i) => (
          <ButtonPrimary key={prog + i} onClick={() => onCourse(prog)}>
            {prog}
          </ButtonPrimary>
        ))}
      </div>
    );
  }

  if (step === 2) {
    const versions = programs.filter(a => a.name == selectedProgramId)


    return (
      <div className="flex flex-col gap-4">
        {versions.map((a) => (
          <ButtonPrimary key={a.version} onClick={() => onVersion(a.version)}>
            {a.version}
          </ButtonPrimary>
        ))}
      </div>
    );
  }

  return null;
}