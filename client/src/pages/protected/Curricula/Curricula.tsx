import { useState } from "react";
import { Card } from "../../../components/Card/Card";
import Layout from "../../../components/layout/Layout";
import { TwoColumnWrapper } from "../../../components/layout/TwoColumnWrapper";
import { H1, H2, } from "../../../components/Text";
import { useCurricula } from "./useCurricula";
import { IconButton } from "../../../components/Buttons";
import {
    ArrowDownCircle,
    ArrowRightCircle,
    Eye,
    EyeClosed,
} from "lucide-react";

const FoldableCard = ({ elem }) => {
    const [isVisible, setVisible] = useState(true);

    return (
        <>
            <div className="col-span-12 flex bg-gray-400 p-4 rounded-xl gap-4">
                <IconButton
                    outerClassName="flex items-center "
                    className="max-w-35 min-w-15 h-full p-2 text-black"
                    Icon={isVisible ? ArrowRightCircle : ArrowDownCircle}
                    onClick={() => setVisible(!isVisible)}
                />
                <div className="flex flex-col gap-2 px-2 ">
                    <h2 className="text-black font-semibold md:text-xl text-lg">{elem.name}</h2>
                    <h3 className="font-medium md:text-xl text-lg">
                        {elem.code} - {elem.ects} ECTS
                    </h3>
                </div>
            </div>
            {!isVisible &&
                elem.courses.map((a) => (
                    <>
                        <div className="col-span-1" />
                        <div className="col-span-11 flex flex-col gap-3 justify-center px-4 p-2 border-2 border-gray-300 rounded-xl">
                            <h2 className="text-black md:text-xl text-lg">{a.name}</h2>
                            <h3 className="font-medium md:text-xl text-lg">
                                {a.code} - {a.ects} ECTS
                            </h3>
                        </div>
                    </>
                ))}
        </>
    );
};

const VisibleList = ({ list, name }) => {
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

            <div className="grid grid-cols-12 gap-4">
                {isVisible && list.map((a: unknown) => <FoldableCard elem={a} />)}
            </div>
        </>
    );
};

export const Curricula = () => {
    const { name, open, finished, stats } = useCurricula();

    return (
        <Layout backURL="/">
            <H1 className="pt-6">{name}</H1>
            <TwoColumnWrapper>
                <Card title={stats[0]} text="Bestandene Module" />
                <Card title={stats[1]} text="Durchschnittnote" />
                <Card title={stats[2]} text="Offene Module" />
                <Card title={stats[3]} text="Semester" />
            </TwoColumnWrapper>
            <VisibleList list={open} name={"Offene Module"} />
            <VisibleList list={finished} name={"Bestandene Module"} />
        </Layout>
    );
};
