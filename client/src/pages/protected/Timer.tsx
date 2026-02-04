import { useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import { H1, H3 } from "../../components/Text";

import { useParams } from "react-router-dom";

//TODO: Liste aller Module des Users vom Backend holen
const subjects = ["Analysis", "SP"]

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
    const params = useParams<{ subject: string }>();

    if (!params.subject)
        return (<ChooseSubject />);

    //TODO: Error-Page
    if (!subjects.includes(params.subject))
        return (<h1>{params.subject} ist kein gültiges Modul</h1>)

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
                <H1>{params.subject}</H1>
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
            <div className="flex flex-col items-center justify-center space-y-2">
                <H1>Module</H1>
                {subjects.map((subject) => (
                    <Link to={`/timer/${subject}`} className="min-w-64 bg-primary  text-white text-lg font-bold p-2 rounded-xl hover:bg-secondary transition-colors disabled:bg-gray-600">
                        {subject}
                    </Link>
                ))}
            </div>
        </Layout>
    )
}