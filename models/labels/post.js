module.exports = {
    id: {
        primary: true,
        type: 'number',
    },
    title: 'string',
    content: 'string',
    createdAt: 'date',
    tagged: {
        type: "relationship",
        target: "Tag",
        relationship: "TAGGED",
        direction: "out"
    },
    is_in: {
        type: "relationship",
        target: "Category",
        relationship: "IS_IN",
        direction: "out"
    },
}