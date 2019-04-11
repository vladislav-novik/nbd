module.exports = {
    id: {
        primary: true,
        type: 'number',
    },
    content: 'string',
    createdAt: 'date',
    commented: {
        type: "relationship",
        target: "Post",
        relationship: "COMMENTED",
        direction: "out"
    },
}