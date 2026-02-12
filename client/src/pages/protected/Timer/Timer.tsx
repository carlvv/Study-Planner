import { useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../../../components/layout/Layout";
import { Link } from "react-router-dom";
import {H1, H3, H4 } from "../../../components/Text";

import { useParams } from "react-router-dom";
import { useTimer, type TimerModulesResponse } from "./useTimer";
import { ArrowLeft, Send } from "lucide-react";
import { Loading } from "../../../components/Loading";

const ErrorMessage = {
    INCOMPLETE_TIME: "Unvollständige Zeitangabe",
    INVALID_MINUTE: "Minuten müssen zwischen 00 und 59 liegen",
    ZERO_TIME: "Die Zeit darf nicht 00:00 sein",
    SERVER_ERROR: "Fehler beim Speichern auf dem Server"
} as const;

type ErrorKey = keyof typeof ErrorMessage;

export default function Timer() {
    const params = useParams<{ subjectId: string }>();

    const { recentData, recentIsLoading, recentIsError, recentError, create, modulesData, modulesIsLoading, modulesIsError, modulesError } = useTimer();

    const [errorMessage, setErrorMessage] = useState<ErrorKey | null>(null);
    const [input, setInput] = useState<string[]>(["_", "_", "_", "_"]);
    const [inputIndex, setInputIndex] = useState<number>(0);

    if (recentIsLoading || modulesIsLoading) {
        return <Loading isLoading={recentIsLoading || modulesIsLoading} />
    }
    if (recentIsError) {
        return <>{recentError?.message}</>
    }
    if (modulesIsError) {
        return <>{modulesError?.message}</>
    }
    if (!params.subjectId)
        return (<ChooseSubject data={modulesData!} />);

    const subject =
        modulesData?.all_modules.find((module) => module.module_id === params.subjectId)

    //TODO: Error-Page
    if (!subject)
        return (<h1>Kein Modul mit {params.subjectId} gefunden</h1>)


    const addDigit = (number: string) => {
        if (inputIndex <= 3) {
            setInput(prev => prev.map((value, index) => index === inputIndex ? number : value));

            setInputIndex(inputIndex + 1)

            setErrorMessage(null)
        }
    }

    const removeLastDigit = () => {
        if (inputIndex > 0) {
            setInput(prev => prev.map((value, index) => index === inputIndex - 1 ? "_" : value));

            setInputIndex(inputIndex - 1)

            setErrorMessage(null)
        }
    }

    const saveTime = () => {
        if (inputIndex !== 4) {
            setErrorMessage("INCOMPLETE_TIME")
            return;
        }

        if (Number(input[2]) > 5) {
            setErrorMessage("INVALID_MINUTE");
            return;
        }

        if (input.every(value => value === "0")) {
            setErrorMessage("ZERO_TIME");
            return;
        }

        setErrorMessage(null)

        //                      10h                          1h                      10m                     1m
        const duration_in_min = Number(input[0]) * 10 * 60 + Number(input[1]) * 60 + Number(input[2]) * 10 + Number(input[3]);

        create({ module_id: params.subjectId ?? "", duration_in_min: duration_in_min, date: new Date() })
        setInput(["_", "_", "_", "_"]);
        setInputIndex(0);
    }

    const renderDigit = (digit: string, index: number) => {
        const isActive = index === inputIndex;
        return (
            <span
                key={index * 1000}
                className={`w-6 text-center text-2xl inline-block 
                    ${isActive ? "animate-pulse text-blue-500" : ""}`}
            >
                {digit}
            </span>
        );
    };

    return (
        <Layout backURL={"/timer"}>
            <div className="flex flex-col items-center justify-center space-y-6">
                <H3>{subject.module_name}</H3>
                <div className="text-3xl">
                    {renderDigit(input[0], 0)}
                    {renderDigit(input[1], 1)}
                    <span className="text-sm text-gray-700">h </span>
                    {renderDigit(input[2], 2)}
                    {renderDigit(input[3], 3)}
                    <span className="text-sm text-gray-700">m</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <button
                            key={i}
                            className="rounded bg-gray-300 p-4 flex items-center justify-center aspect-square text-2xl"
                            onClick={() => addDigit(String(i))}
                        >
                            {i}
                        </button>
                    ))}

                    <button
                        style={{ background: "#4281E0" }}
                        className="rounded bg-gray-300 p-4 flex items-center justify-center aspect-square"
                        onClick={() => saveTime()}
                    >
                        <Send></Send>
                    </button>
                    <button
                        className="rounded bg-gray-300 p-4 flex items-center justify-center aspect-square text-2xl  "
                        onClick={() => addDigit("0")}
                    >
                        0
                    </button>
                    <button
                        style={{ background: "#CE1F6B" }}
                        className="rounded bg-gray-300 p-4 flex items-center justify-center aspect-square"
                        onClick={() => removeLastDigit()}
                    >
                        <ArrowLeft></ArrowLeft>
                    </button>

                </div>

                {errorMessage !== null && (
                    <p className="text-red-500">{ErrorMessage[errorMessage]}</p>
                )}

                <H4>Letzten Aktivitäten</H4>
                {!recentData || !modulesData ? (<></>) : recentData.slice(0, 5).map((i, index) => (
                    <div key={i.module_id + i.duration_in_min + i.owner_id + index} className="grid grid-cols-2 items-center w-full">
                        <p className="text-left">{modulesData.all_modules.find((module) => module.module_id === i.module_id)?.module_name}</p>
                        <p className="text-right">{i.duration_in_min >= 60 ? Math.floor(i.duration_in_min / 60) + "h" : ""} {i.duration_in_min % 60 == 0 ? "00m" : i.duration_in_min % 60 + "m"}</p>
                    </div>
                ))}
            </div>
        </Layout>
    )
}

function ChooseSubject({ data }: { data: TimerModulesResponse }) {
    return (
        <Layout backURL={"/"}>
            <div className="flex flex-col items-start space-y-4 p-4">
                <H1>Module</H1>

                <div className="flex flex-col w-full space-y-2">
                    <H3>Aktuelle</H3>
                    {!data.active_modules ?
                     (<p>Wähle deine aktuellen Module aus indem du einen Studenplan erstellst</p>) :
                        data.active_modules.map((module) => (
                            <Link to={`/timer/${module.module_id}`} className="">
                                <div className="flex justify-between w-full bg-gray-100 p-2 rounded border border-gray-500 shadow">
                                    <span>{module.module_name}</span>
                                </div>
                            </Link>
                        ))}
                </div>

                <div className="flex flex-col w-full space-y-2">
                    <H3>Alle</H3>
                    {data.all_modules.map((module) => (
                        <Link to={`/timer/${module.module_id}`} className="">
                            <div className="flex justify-between w-full bg-gray-100 p-2 rounded border border-gray-500 shadow">
                                <span>{module.module_name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    )
}