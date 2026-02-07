import { useState } from "react";
import { Card } from "../../../components/Card/Card";
import Layout from "../../../components/layout/Layout";
import { TwoColumnWrapper } from "../../../components/layout/TwoColumnWrapper";
import { H1, H2, } from "../../../components/Text";
import { useCurricula } from "./useCurricula";
import { type Course, type Module } from "../../../types";
import { IconButton } from "../../../components/Buttons";
import {
    ArrowDownCircle,
    ArrowRightCircle,
    Eye,
    EyeClosed,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetch_backend_auth } from "../../../utils/helper";

const GradeModal = ({
    course,
    onClose,
    onSave,
    error,
    isLoading,
    onDelete
}: {
    course: Course;
    error: string;
    isLoading: boolean,
    onClose: () => void;
    onDelete: () => void;
    onSave: (grade: number) => void;
}) => {
    const [mode, setMode] = useState<"passed" | "grade">(
        course.grade === 0 ? "passed" : "grade"
    );
    const [grade, setGrade] = useState(course.grade || 1.0);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 flex flex-col gap-4">
                <h2 className="text-xl font-semibold">{course.name}</h2>

                {/* Auswahl */}
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={mode === "passed"}
                            onChange={() => setMode("passed")}
                        />
                        bestanden
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={mode === "grade"}
                            onChange={() => setMode("grade")}
                        />
                        Note
                    </label>
                </div>

                {/* Note */}
                {mode === "grade" && (
                    <input
                        type="number"
                        step="0.1"
                        min="1.0"
                        max="5.0"
                        value={grade}
                        onChange={(e) => setGrade(Number(e.target.value))}
                        className="border p-2 rounded"
                    />
                )}
                {error != "" && <p className="text-red-500">{error}</p>}
                {isLoading &&
                    <div className="flex justify-center items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></div>
                    </div>
                }

                <div className="flex justify-end gap-2 pt-2">
                    {course.finished && <>
                        <button
                            className="px-4 py-2 rounded bg-red-500 text-white"
                            onClick={onDelete}

                        >
                            Note löschen
                        </button>
                    </>}

                    <button
                        className="px-4 py-2 rounded bg-gray-300"
                        onClick={onClose}
                    >
                        Abbrechen
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-blue-500 text-white"
                        onClick={() =>
                            onSave(mode === "passed" ? 0 : grade)
                        }
                    >
                        Speichern
                    </button>
                </div>
            </div>
        </div>
    );
};




const FoldableCard = ({ elem }: { elem: Module }) => {
    const [isVisible, setVisible] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [err, setError] = useState("");


    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async ({ moduleId, courseId, grade }: { moduleId: string; courseId: string; grade: number }) => {
            const response = await fetch_backend_auth('/curricula_update', {
                method: 'POST',
                body: JSON.stringify({ module_id: moduleId, course_id: courseId, grade }),
            });
            if (!response.ok) throw new Error('Fehler beim Speichern der Note');
            return response.json();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["curricula-data"],
            })
            setModalOpen(false);
        },
    });


    const deleteMutation = useMutation({
        mutationFn: async ({ moduleId, courseId }: { moduleId: string; courseId: string }) => {
            const response = await fetch_backend_auth('/curricula_delete', {
                method: 'POST',
                body: JSON.stringify({ module_id: moduleId, course_id: courseId }),
            });
            if (!response.ok) throw new Error('Fehler beim Löschen der Note');
            return response.json();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["curricula-data"],
            });
            setModalOpen(false);
        },
    });
    return (
        <>
            <div className={`col-span-12 flex ${elem.finished ? "bg-blue-300" : "bg-gray-400"} p-2 rounded-xl gap-4`}>
                <IconButton
                    outerClassName="flex items-center "
                    className="max-w-35 min-w-15 h-full p-2 text-black"
                    Icon={isVisible ? ArrowRightCircle : ArrowDownCircle}
                    onClick={() => setVisible(!isVisible)}
                />
                <div className="flex flex-col gap-2 px-2 ">
                    <h2 className="text-black font-semibold md:text-xl text-lg">{elem.name}</h2>
                    <h3 className="font-medium md:text-xl text-lg">
                        {elem.code} - {elem.ects + ""} ECTS
                    </h3>
                </div>
            </div>
            {!isVisible &&
                elem.courses.map((a: Course) => (
                    <>
                        <div className="col-span-1" />
                        <div className="col-span-11 flex px-4 p-2 border-2 border-gray-300 rounded-xl justify-between items-center" onClick={() => {
                            setSelectedCourse(a);
                            setModalOpen(true);
                        }}>
                            <div className="flex flex-col gap-1 justify-center ">
                                <h2 className="text-black md:text-xl text-lg">{a.name}</h2>
                                <h3 className="font-medium md:text-xl text-lg">
                                    {a.code} - {a.ects} ECTS
                                </h3>
                            </div>
                            {a.finished && <div className="bold text-lg pr-8">{a.grade == 0 ? "bestanden" : a.grade.toFixed(1)}</div>}
                        </div>

                    </>
                ))}
            {isModalOpen && selectedCourse && (
                <GradeModal
                    course={selectedCourse}
                    isLoading={mutation.isPending}
                    error={err}
                    onClose={() => setModalOpen(false)}
                    onDelete={() => {
                        if (!selectedCourse) return;
                        deleteMutation.mutate({
                            moduleId: elem.code,
                            courseId: selectedCourse.code,
                        });
                    }}
                    onSave={async (grade) => {
                        if (grade != 0 && (grade < 1 || grade > 4)) {
                            setError("keine gültige Note")
                            return
                        }
                        setError("")

                        if (!selectedCourse) return;
                        mutation.mutate({
                            moduleId: elem.code,
                            courseId: selectedCourse.code,
                            grade,
                        })
                    }}
                />

            )}

        </>
    );
};

const VisibleList = ({ list, name }: { list: Module[], name: string }) => {
    const [isVisible, setVisible] = useState(true);

    return (
        <>
            <div className="flex items-center justify-between mt-4 mb-6">
                <H2 className="text-bold">{name}</H2>
                <IconButton
                    className="mr-4"
                    Icon={isVisible ? Eye : EyeClosed}
                    size={40}
                    onClick={() => setVisible(!isVisible)}
                />
            </div>


            <div className="grid grid-cols-12 gap-2">
                {isVisible && list.map((a: Module, id) => <FoldableCard key={id} elem={a} />)}
            </div>
        </>
    );
};

export const Curricula = () => {
    const d = useCurricula();
    if (!d || d.isLoading) {
        return <>Es wird geladen...</>
    }
    return (
        <Layout backURL="/">
            <H1 className="pt-6">{d.name}</H1>
            <TwoColumnWrapper>
                <Card title={d.stats[0] + ""} text="Bestandene ECTS" />
                <Card title={d.stats[1] + ""} text="Durchschnittnote" />
                <Card title={d.stats[2] + ""} text="Offene ECTS" />
                <Card title={d.stats[3] + "."} text="Semester" />
            </TwoColumnWrapper>
            <VisibleList list={d.modules.filter(a => a.finished)} name={"Bestandenen Module"} />
            <VisibleList list={d.modules.filter(a => !a.finished)} name={"Offene Module"} />
        </Layout>
    );
};
