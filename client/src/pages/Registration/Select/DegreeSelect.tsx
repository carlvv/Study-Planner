import { ButtonPrimary } from "../../../components/Buttons";

export function DegreeSelect({
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