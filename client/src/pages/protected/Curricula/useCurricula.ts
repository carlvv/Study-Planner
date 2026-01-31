
const open = [
    {
        name: "Lineare Algebra",
        code: "MB051",
        ects: 5,
        courses: [
            {
                name: "Lineare Algebra",
                code: "TB051",
                ects: 5,
            }
        ]
    },
    {
        name: "Technologien der Mediengestaltung und GUI Programmierung",
        code: "MB051",
        ects: 5,
        courses: [
            {
                name: "Technologien der Mediengestaltung und GUI Programmierung",
                code: "TB051",
                ects: 5,
            }
        ]
    }
];

const finished = [
    {
        name: "Analysis",
        code: "MB001",
        ects: 5,
        grade: 4.0,
        courses: [
            {
                name: "Analysis",
                code: "TB001",
                ects: 5,
                grade: 4.0,
            }
        ]
    },
    {
        name: "Systemnahe Programmierung",
        code: "MB030",
        ects: 5,
        grade: 1.7,
        courses: [
            {
                name: "Systemnahe Programmierung",
                code: "TB030",
                ects: 3,
                grade: 1.7
            },
            {
                name: "Übg. Systemnahe Programmierung",
                code: "TB031",
                ects: 2,
                status: "erfüllt"
            },
        ]
    },

    {
        name: "Rechnernetze",
        code: "MB041",
        ects: 5,
        grade: 3.0,
        courses: [
            {
                name: "Rechnernetze",
                code: "TB041",
                ects: 5,
                grade: 3.0,
            },
            {
                name: "Prak. Rechnernetze",
                code: "TB042",
                ects: 5,
                grade: 0.0
            }
        ]
    }
];


export const useCurricula = () => {
    return { name: "BSC Informatik", open, finished, stats: ["170 ECTS", "3,1415", "40 ECTS", "6. Semester"] }
}