import { Check, Plus } from "lucide-react";
import Layout from "../../../../components/layout/Layout";
import { IconButton } from "../../../../components/Buttons";
import { H1 } from "../../../../components/Text";

const d = [
  {
    semester: "SS24",
    plaene: [{ id: 1, name: "Stundenplan 1", modules: 6 }],
  },
  {
    semester: "WS25",
    plaene: [{ id: 2, name: "Stundenplan 2", modules: 5 }],
  },
  {
    semester: "SS26",
    plaene: [
      { id: 3, name: "Stundenplan 3", modules: 8 },
      { id: 4, name: "Stundenplan 4", modules: 8 },
    ],
  },
];

export const ScheduleSettings = () => {
  const data = d;
  const activePlanId = 1;
  return (
    <Layout backURL="/schedule">
      <div className="flex items-center justify-between my-6">
        <H1>Stundenpläne</H1>
        <IconButton
          Icon={Plus}
          size={50}
          className="ml-auto bg-gray-800 rounded-xl p-2 text-white"
          outerClassName=""
        />
      </div>

      {data.map((semester) => (
        <div key={semester.semester} className="mb-6">
          <h2 className="font-medium text-gray-700 mb-2">
            {semester.semester}
          </h2>
          <div className="space-y-2">
            {semester.plaene.map((plan) => (
              <div
                key={plan.id}
                className={`p-4 rounded-md border border-gray-400 ${
                  plan.id === activePlanId
                    ? "bg-gray-300"
                    : "bg-gray-100"
                } flex justify-between items-center`}
              >
                <div>
                  <div className="font-medium">{plan.name}</div>
                  <div className="text-sm text-gray-600">
                    {plan.modules} Module
                  </div>
                </div>
                {plan.id === activePlanId && <Check />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </Layout>
  );
};
