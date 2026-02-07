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

const FoldableCard = ({ elem }: { elem: Module }) => {
    const [isVisible, setVisible] = useState(true);

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
                        <div className="col-span-11 flex px-4 p-2 border-2 border-gray-300 rounded-xl justify-between items-center">
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
