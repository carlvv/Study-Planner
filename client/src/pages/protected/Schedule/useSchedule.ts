
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
}

const bsp: TimeTable = {
    semester: "SS24",
    days: [
        [{
            startMinute: 8 * 60 + 33,
            endMinute: 9 * 60 + 5,
            lecturer: "dsg",
            name: "Programmstrukturen 1",
            room: "HS7"
        },
        {
            startMinute: 9 * 60 + 30,
            endMinute: 10 * 60,
            lecturer: "dsg",
            name: "Programmstrukturen 1",
            room: "HS7"
        }],
        [],
        [{
            startMinute: 8 * 60 + 33,
            endMinute: 9 * 60 + 5,
            lecturer: "dsg",
            name: "Programmstrukturen 1",
            room: "HS7"
        },
        {
            startMinute: 9 * 60 + 30,
            endMinute: 10 * 60,
            lecturer: "dsg",
            name: "Programmstrukturen 1",
            room: "HS7"
        }]
    ]
}


export const useSchedule = (): TimeTable | null => {
    const timetable: TimeTable | null = null

    return timetable;
};
