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

export default function Timer() {
    const params = useParams<{ subject: string }>();

    if (!params.subject)
        return (<ChooseSubject />);

    //TODO: Error-Page
    if (!subjects.includes(params.subject))
        return (<h1>{params.subject} ist kein gültiges Modul</h1>)

    const [input, setInput] = useState<string>("");

    const addDigit = (number: number) => {
        if (input.length < 4) {
            setInput(prev => prev + number)
        }
    }

    const removeLastDigit = () => {
        if (input.length > 0) {
            setInput(prev => prev.slice(0, -1))
        }
    }

    const saveTime = () => {

        const { hours, minutes } = getTimeParts(input);

        let numberHours: number = Number(hours);
        let numberMinutes: number = Number(minutes)

        //Minuten über 60 anpassen
        if (numberMinutes >= 60) {
            numberMinutes -= 60;
            numberHours++;
        }


        //TODO: Verbindung mit Backend
    }

    const getTimeParts = (input: string) => {
        const value = Number(input || "0");

        const hours = Math.floor(value / 100);
        const minutes = value % 100;

        return {
            hours: String(hours).padStart(2, "0"),
            minutes: String(minutes).padStart(2, "0"),
        };
    };

    const { hours, minutes } = getTimeParts(input);

    return (
        <Layout backURL={"/dashboard"}>
            <div className="flex flex-col items-center justify-center space-y-6">
                <H1>{params.subject}</H1>
                <p>{hours}h {minutes}m</p>
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <button
                            key={i}
                            className="rounded bg-gray-300 p-4 flex items-center justify-center aspect-square"
                            onClick={() => addDigit(i)}
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
                        onClick={() => addDigit(0)}
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
                <H1>Wähle ein Modul aus</H1>
                {subjects.map((subject) => (
                    <Link to={`/timer/${subject}`} className="min-w-64 bg-primary  text-white text-lg font-bold p-2 rounded-xl hover:bg-secondary transition-colors disabled:bg-gray-600">
                        {subject}
                    </Link>
                ))}
            </div>
        </Layout>
    )
}