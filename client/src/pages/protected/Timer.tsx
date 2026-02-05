import { useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import { H1, H3 } from "../../components/Text";

import { useParams } from "react-router-dom";

//TODO: Liste aller Module des Users vom Backend holen
const currentSubjects = [{ name: "Analysis", id: 1, ects: 5 }, { name: "Programmstrukturen 1", id: 2, ects: 5 }, { name: "Programmstrukturen 2", id: 3, ects: 5 }]
const otherSubjects = [{ name: "Systemnahe Programmierung", id: 4, ects: 5 }, { name: "Lineare Algebra", id: 5, ects: 5 }, { name: "Unix", id: 6, ects: 5 }]

//TODO: Letzten Aktivitäten vom Backend holen
const recentActivities = [{ subject: "BWL", hours: 1, minutes: 20 }, { subject: "SP", hours: 0, minutes: 35 }]


const ErrorMessage = {
    INCOMPLETE_TIME: "Unvollständige Zeitangabe",
    INVALID_MINUTE: "Minuten müssen zwischen 00 und 59 liegen",
    ZERO_TIME: "Die Zeit darf nicht 00:00 sein",
    SERVER_ERROR: "Fehler beim Speichern auf dem Server"
} as const;

type ErrorKey = keyof typeof ErrorMessage;

export default function Timer() {
    const params = useParams<{ subjectId: string }>();

    if (!params.subjectId)
        return (<ChooseSubject />);

    const subject =
        currentSubjects.find(obj => String(obj.id) === params.subjectId) ??
        otherSubjects.find(obj => String(obj.id) === params.subjectId)

    //TODO: Error-Page
    if (!subject)
        return (<h1>Kein Modul mit {params.subjectId} gefunden</h1>)

    const [errorMessage, setErrorMessage] = useState<ErrorKey | null>(null);

    const [input, setInput] = useState<string[]>(["_", "_", "_", "_"]);
    const [inputIndex, setInputIndex] = useState<number>(0);

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

        //TODO: Verbindung mit Backend
        if (false) {
            setErrorMessage("SERVER_ERROR");
            return;
        }
    }

    const renderDigit = (digit: string, index: number) => {
        const isActive = index === inputIndex;
        return (
            <span
                key={index}
                className={`w-6 text-center text-2xl inline-block 
                    ${isActive ? "animate-pulse text-blue-500" : ""}`}
            >
                {digit}
            </span>
        );
    };

    return (
        <Layout backURL={"/dashboard"}>
            <div className="flex flex-col items-center justify-center space-y-6">
                <H1>{subject.name}</H1>
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
                            className="rounded bg-gray-300 p-4 flex items-center justify-center aspect-square"
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
                        ➤
                    </button>
                    <button
                        className="rounded bg-gray-300 p-4 flex items-center justify-center aspect-square"
                        onClick={() => addDigit("0")}
                    >
                        0
                    </button>
                    <button
                        style={{ background: "#CE1F6B" }}
                        className="rounded bg-gray-300 p-4 flex items-center justify-center aspect-square"
                        onClick={() => removeLastDigit()}
                    >
                        ⌫
                    </button>

                </div>

                {errorMessage !== null && (
                    <p className="text-red-500">{ErrorMessage[errorMessage]}</p>
                )}

                <H3>Letzten Aktivitäten</H3>
                {recentActivities.map((i) => (
                    <div className="grid grid-cols-2 items-center w-full">
                        <p className="text-center">{i.subject}</p>
                        <p className="text-center">{i.hours > 0 ? i.hours + "h" : ""} {i.minutes}m</p>
                    </div>
                ))}
            </div>
        </Layout>
    )
}

function ChooseSubject() {
    return (
        <Layout backURL={"/dashboard"}>
            <div className="flex flex-col items-start space-y-4 p-4">
                <H1>Module</H1>

                <div className="flex flex-col w-full space-y-2">
                    <H3>Aktuelle</H3>
                    {currentSubjects.map((subject) => (
                        <Link to={`/timer/${subject.id}`} className="">
                            <div className="flex justify-between w-full bg-gray-100 p-2 rounded border border-gray-500 shadow">
                                <span>{subject.name}</span>
                                <span>{subject.ects} ECTS</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col w-full space-y-2">
                    <H3>Andere</H3>
                    {otherSubjects.map((subject) => (
                        <Link to={`/timer/${subject.id}`} className="">
                            <div className="flex justify-between w-full bg-gray-100 p-2 rounded border border-gray-500 shadow">
                                <span>{subject.name}</span>
                                <span>{subject.ects} ECTS</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    )
}