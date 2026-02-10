import { useQuery } from "@tanstack/react-query";
import { fetch_backend_auth } from "../../../utils/helper";

export type TimeTableDay = {
    startMinute: number,
    endMinute: number,
    lecturer: string,
    name: string,
    room: string,
}


export type TimeTable = {
    days: TimeTableDay[][]
    semester: string
    name: string
}


export const useSchedule = () => {
    return useQuery({
        queryKey: ["schedule_tt"],
        queryFn: async () => {
            const res = await fetch_backend_auth("/timetable/get_active")
            const all = (await res.json());
            if (all == "empty") {
                return null
            }
            const data = all.events;


            const timeToMinutes = (timeStr: string) => {
                const [start, end] = timeStr.split(' - ');
                const [h, m] = start.split(':').map(Number);
                const [eh, em] = end.split(':').map(Number);
                return [h * 60 + m, eh * 60 + em];
            };

            const days: TimeTableDay[][] = [[], [], [], [], [], [], []];

            data.forEach((course: any) => {
                course.days.forEach((d: any) => {
                    const dayIndex = d.day.day_id - 1;
                    const [startMinute, endMinute] = timeToMinutes(d.start_time.desc);
                    const room = d.rooms[0]?.desc_kurz ?? "";

                    days[dayIndex].push({
                        startMinute,
                        endMinute,
                        lecturer: "",
                        name: course.name + (course.name_add ?? ""),
                        room
                    });
                });
            });

            return {
                days,
                semester: all.semester,
                name: all.name
            } as TimeTable;
        }
    })
};
