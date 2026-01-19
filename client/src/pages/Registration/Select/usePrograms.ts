


const data = [
    {
        id: "B_INF",
        isbachelor: true,
        name: "Informatik",
        versions: [
            '25.0',
            '23.0',
            '20.0',
            '19.0'
        ]
    },
    {
        id: "B_BWL",
        isbachelor: true,
        name: "Betriebtswirschaftslehre",
        versions: [
            '25.0a',
            '23.0',
            '20.0',
            '19.0'
        ]
    },
    {
        id: "B_BWL",
        isbachelor: false,
        name: "Betriebtswirschaftslehre",
        versions: [
            '25.0a',
            '19.0'
        ]
    }
]

export function usePrograms() {
    // todo fetch

    return data
}