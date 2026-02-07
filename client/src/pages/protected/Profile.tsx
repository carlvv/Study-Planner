import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetch_backend_auth } from "../../utils/helper";
import Layout from "../../components/layout/Layout";
import { H1 } from "../../components/Text";
import { ButtonPrimary } from "../../components/Buttons";
import { useState } from "react";
import { DegreeSelect } from "../Registration/Select/DegreeSelect";
import type { Curricula } from "../../types";
import { CourseSelect } from "../Registration/Select/CourseSelect";
import { Loading } from "../../components/Loading";
interface Data { name: string, id: string, programm: string, isbachelor: boolean, version: string, }
export const Profile = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["profile-data"],
        queryFn: async () => {
            const res = await fetch_backend_auth("/profile");
            return res.json() as unknown as Data;
        },
        staleTime: Infinity,
        refetchOnMount: "always",
    });
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState<"warn" | "done" | "pick1" | "pick2" | "pick3">("warn");


    const queryClient = useQueryClient()
    const changeMutation = useMutation({
        mutationFn: async ({ data }: { data: Curricula }) => {
            const res = await fetch_backend_auth("/auth/profile_change", {
                method: "POST",
                body: JSON.stringify({ "study_id": data.program_version })
            })
            if (!res.ok) {
                return new Error("Konnte nicht gemacht werden!")
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["profile-data"],
            })
        }
    })


    function onChange() {
        setStep("warn");
        setShowModal(true);
    }

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
    }

    if (isLoading) {
        return (
            <Loading isLoading={isLoading} />
        );
    }
    return (
        <Layout backURL="/">
            <H1 className="pt-6">Profil</H1>
            <div className="m-auto mt-8  w-full rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100">
                <h2 className="mb-6 text-xl font-semibold text-gray-800">
                    Persönliche Daten
                </h2>

                <div className="space-y-4 text-gray-700">
                    <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{data?.name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Matrikelnummer</p>
                        <p className="font-medium">{data?.id}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Studiengang</p>
                        <p className="font-medium">
                            {data?.isbachelor ? "Bachelor" : "Master"} {data?.programm}
                        </p>
                    </div>

                    <div className="w-full flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Studiengang ID</p>
                            <p className="font-mono text-sm">{data?.version}</p>
                        </div>
                        <div>
                            <ButtonPrimary className="min-w-0 text-[10px] font-medium p-3 bg-red-500" onClick={onChange}>
                                <p>Studiengang-Wechseln</p>
                            </ButtonPrimary>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowModal(false)}
                    />

                    {/* MODAL */}
                    <div className="relative z-10 w-full max-w-md max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col">

                        {/* Header */}
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900 text-center">
                                {step === "warn" && "Studiengang wechseln?"}
                                {(step === "pick1" || step === "pick2" || step === "pick3") && "Welcher Studiengang?"}
                                {step === "done" && "Wechsel eingeleitet"}
                            </h3>
                        </div>

                        {/* Scrollbarer Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {step === "warn" && (
                                <p className="text-sm text-gray-600">
                                    Diese Aktion kann nicht rückgängig gemacht werden.
                                    Alle Daten werden bei einem Wechsel gelöscht.
                                </p>
                            )}

                            {step === "pick1" && (
                                <DegreeSelect
                                    selectBachelor={() => {
                                        updateCurricula("isBachelor", true);
                                        setStep("pick2");
                                    }}
                                    selectMaster={() => {
                                        updateCurricula("isBachelor", false);
                                        setStep("pick2");
                                    }}
                                />
                            )}

                            {step === "pick2" && (
                                <CourseSelect
                                    step={1}
                                    isbachelor={curriculaData.isBachelor}
                                    selectedProgramId={curriculaData.program_name}
                                    onCourse={(id) => {
                                        updateCurricula("program_name", id)
                                        setStep("pick3")
                                    }}
                                    onVersion={(ver) => updateCurricula("program_version", ver)}
                                />
                            )}

                            {step === "pick3" && (
                                <CourseSelect
                                    step={2}
                                    isbachelor={curriculaData.isBachelor}
                                    selectedProgramId={curriculaData.program_name}
                                    onCourse={(id) => updateCurricula("program_name", id)}
                                    onVersion={(ver) => {
                                        updateCurricula("program_version", ver)
                                        setStep("done")
                                    }}
                                />
                            )}

                            {step === "done" && (
                                <>

                                    <div>
                                        <div>
                                            <span className="font-mono text-sm">
                                                {data?.isbachelor ? "Bachelor" : "Master"} {data?.programm}
                                            </span> <br />
                                            <span className="font-mono text-sm p-2">{"=>"}</span>
                                            <span className="font-mono text-sm font-bold">
                                                {curriculaData.isBachelor ? "Bachelor" : "Master"} {curriculaData.program_name}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-mono text-sm">{data?.version}</span><br />
                                            <span className="font-mono text-sm p-2">{"=>"}</span>
                                            <span className="font-mono text-sm font-bold">{curriculaData?.program_version}</span>
                                        </div>
                                    </div>
                                </>

                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t flex justify-end gap-3">
                            {step === "warn" && (
                                <>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Abbrechen
                                    </button>
                                    <button
                                        onClick={() => setStep("pick1")}
                                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                    >
                                        Bestätigen
                                    </button>
                                </>
                            )}

                            {step === "done" && (
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        changeMutation.mutate({ data: curriculaData })
                                    }}
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary"
                                >
                                    Weiter
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}



        </Layout>
    );
};
