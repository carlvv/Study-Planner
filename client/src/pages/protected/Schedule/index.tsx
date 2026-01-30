import { Settings } from "lucide-react";
import Layout from "../../../components/layout/Layout";
import { H1, H3 } from "../../../components/Text";
import { useSchedule, type TimeTable, type TimeTableDay } from "./useSchedule";
import { IconButton } from "../../../components/Buttons";
import { zip } from "../../../utils/zip";
import { displayTotalTime } from "../Dashboard/Dashboard";

function Hint() {
  return (
    <p className="text-gray-400 text-wrap text-3xl pt-60">
      Erstelle ein Stundenplan mit den ⚙️
    </p>
  );
}
function displayTime(startMinute: number, endMinute: number) {
  function getTime(time: number): string {
    let h = Math.floor(time / 60).toFixed(0);
    let m = (time % 60).toFixed(0);
    if (h.length == 1) {
      h = "0" + h;
    }
    if (m.length == 1) {
      m = "0" + m;
    }
    return h + ":" + m;
  }

  return `${getTime(startMinute)} - ${getTime(endMinute)}`;
}

function displayPause(startMinute: number, endMinute: number) {
  return displayTotalTime(endMinute - startMinute);
}

function Course({
  course,
  idx,
  n,
  endMinute,
}: {
  course: TimeTableDay;
  idx: number;
  n: number;
  endMinute: number;
}) {
  return (
    <>
      <div className="col-span-9 mb-4">
        <div className="flex justify-between items-center p-4 bg-gray-300 rounded-lg">
          <div className="flex flex-col gap-2">
            <p className="font-medium text-lg text-wrap text-black">
              {course.name}
            </p>
            <p className="font-medium text-lg">
              {displayTime(course.startMinute, course.endMinute)}
            </p>
          </div>
          <div className="hidden md:flex flex-col gap-2">
            <p className="font-medium text-2xl text-black text-right">
              {course.lecturer}
            </p>
            <p className="font-medium text-xl text-right">{course.room}</p>
          </div>
        </div>
        {idx < n - 1 && (
          <div className="hidden sm:flex w-full justify-end">
            <div className="bg-black w-20 h-0.5 mt-4" />
          </div>
        )}
      </div>
      <div className="hidden sm:block col-span-3 relative">
        {idx > 0 && idx < n && (
          <div className="absolute -top-8 left-3 text-wrap text-lg">
            {displayPause(endMinute, course.startMinute)} Pause
          </div>
        )}
      </div>
    </>
  );
}

function TimeTable({ days }: { days: TimeTableDay[][] }) {
  const labels = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ];

  return (
    <>
      {zip(days, labels).map((day) => {
        if (day[0].length == 0) {
            return <></>
        }
        return (
          <div>
            <H3 className="pb-6">{day[1]}</H3>
            <div className="grid grid-cols-9 sm:grid-cols-12">
              {day[0].map((course, idx) => (
                <Course
                  course={course}
                  idx={idx}
                  n={day[0].length}
                  endMinute={idx > 0 ? day[0][idx - 1].endMinute : 0}
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

export const Schedule = () => {
  const isActive = useSchedule();

  return (
    <Layout backURL="/">
      <div className="flex items-center justify-between pt-6 ">
        <H1>
          {!isActive ? "Stundenplan" : "Stundenplan - " + isActive.semester}
        </H1>
        <IconButton
          className="ml-auto bg-gray-800 rounded-xl p-2"
          to="/schedule/settings"
          size={50}
          Icon={Settings}
        />
      </div>
      <div className="flex flex-col justify-between pt-6">
        {!isActive ? <Hint /> : <TimeTable days={isActive.days} />}
      </div>
    </Layout>
  );
};
