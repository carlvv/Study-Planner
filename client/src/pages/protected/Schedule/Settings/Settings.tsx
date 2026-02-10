import { Check, Plus, X } from "lucide-react";
import { useState } from "react";
import Layout from "../../../../components/layout/Layout";
import { IconButton } from "../../../../components/Buttons";
import { H1 } from "../../../../components/Text";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetch_backend_auth } from "../../../../utils/helper";
import { Loading } from "../../../../components/Loading";
import TextInput from "../../../../components/Input";

interface Data {
  active: boolean,
  event_ids: number[]
  name: string,
  owner_id: string,
  semester: string,
  _id: any
}
type GroupedData = [string, Data[]][]; // [semester, Data[]][]

export const ScheduleSettings = () => {
  const { data, isLoading } = useQuery<GroupedData>({
    queryKey: ["all_timetable"],
    queryFn: async () => {
      const res = await fetch_backend_auth("/timetable/get_all");
      const items: Data[] = await res.json();

      const grouped: Record<string, Data[]> = items.reduce((acc, item) => {
        const key = item.semester;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {} as Record<string, Data[]>);

      return Object.entries(grouped);
    },
  });

  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationKey: ["all_timetable"],
    mutationFn: async ({ id }: { id: string }) => {      
      const res = await fetch_backend_auth("/timetable/set_active", {
        method: "POST",
        body: JSON.stringify(id)
      });
      if (!res.ok) {
        new Error("Server not responding")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all_timetable"],
      })
    }
  });

  if (isLoading) {
    return <Loading isLoading={isLoading} />;
  }

  return (
    <Layout backURL="/schedule">
      <div className="flex items-center justify-between my-6">
        <H1>Stundenpläne</H1>
        <IconButton
          Icon={Plus}
          size={50}
          onClick={() => setOpen(true)}
          className="ml-auto bg-gray-800 rounded-xl p-2 text-white"
        />
      </div>

      {data?.map(([semester, data]) => (
        <div key={semester} className="mb-6">
          <h2 className="font-medium text-gray-700 mb-2">
            {semester}
          </h2>
          <div className="space-y-2">
            {data.map((plan, id) => (
              <div 
                onClick={() => mutate({id: plan._id.$oid})}
                key={id + plan.semester}
                className={`p-4 rounded-md border border-gray-400 ${plan.active
                  ? "bg-gray-300"
                  : "bg-gray-100"
                  } flex justify-between items-center`}
              >
                <div>
                  <div className="font-medium">{plan.name}</div>
                  <div className="text-sm text-gray-600">
                    {plan.event_ids.length} Module
                  </div>
                </div>
                {plan.active && <Check />}
              </div>
            ))}
          </div>
        </div>
      ))}

      {open && <CreateScheduleModal onClose={() => setOpen(false)} />}
    </Layout>
  );
};


const CreateScheduleModal = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<number[]>([]);

  const handleNext = () => {
    if (type === "manuell") {
      setStep(2);
    } else {
      // später: KI / automatisch
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-xl p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500"
        >
          <X />
        </button>

        {step === 1 && (
          <StepOne
            type={type}
            setType={setType}
            onNext={handleNext}
          />
        )}

        {step === 2 && (
          <StepTwo
            selectedModules={selectedModules}
            setSelectedModules={setSelectedModules}
            onSend={onClose}
          />
        )}
      </div>
    </div>
  );
};

const StepOne = ({
  type,
  setType,
  onNext,
}: {
  type: string | null;
  setType: (v: string) => void;
  onNext: () => void;
}) => {
  return (
    <>
      <h2 className="text-lg font-medium mb-6">
        Stundenplan erstellen
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2">
            Erstellungsart
          </label>
          {/* TODO */}
          <div className="space-y-2">
            {["manuell"].map((v) => ( 
              <label key={v} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  checked={type === v}
                  onChange={() => setType(v)}
                />
                {v}
              </label>
            ))}
          </div>
        </div>

        <button
          disabled={!type}
          onClick={onNext}
          className="w-full bg-gray-900 text-white py-2 rounded-md disabled:opacity-50"
        >
          Weiter
        </button>
      </div>
    </>
  );
};



const StepTwo = ({
  selectedModules,
  setSelectedModules,
  onSend
}: {
  selectedModules: number[];
  setSelectedModules: (ids: number[] | ((prev: number[]) => number[])) => void;
  onSend: () => void
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["module_timetable"],
    queryFn: async () => {
      const res = await fetch_backend_auth("/timetable/get_by_curricula");
      const items = await res.json();

      items.sort((a: any, b: any) => a.id - b.id);

      return items;
    },
  });
  const queryClient = useQueryClient()
  const sendModulesMutation = useMutation({
    mutationFn: async ({ ids, text }: { ids: number[], text: string }) => {
      const res = await fetch_backend_auth("/timetable/create_timetable", {
        method: "POST",
        body: JSON.stringify({ module_ids: ids, "name": text }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit modules");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all_timetable"],
      })
      onSend()
    }
  },
  );
  const [text, setText] = useState("")

  const toggleModule = (id: number): void => {
    setSelectedModules((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  if (isLoading) {
    return <Loading isLoading={data} />;
  }

  return (
    <>
      <h2 className="text-lg font-medium mb-4">Module auswählen</h2>
      <TextInput label="Name:" placeholder="Stundenplan 1" value={text} onChange={setText} />

      <div className="max-h-105 overflow-y-auto border rounded-md mb-4 mt-4">
        <div className="divide-y">
          {data.map((module: any) => {
            const checked = selectedModules.includes(module.id);

            return (
              <label
                key={module.id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${checked ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleModule(module.id)}
                />
                <span>{module.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      <button
        disabled={
          selectedModules.length === 0 || sendModulesMutation.isPending || text.length == 0
        }
        onClick={() => sendModulesMutation.mutate({ ids: selectedModules, text })}
        className="w-full bg-gray-900 text-white py-2 rounded-md disabled:opacity-50"
      >
        {sendModulesMutation.isPending ? "Senden…" : "Absenden"}
      </button>
    </>
  );
};

