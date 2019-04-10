module.exports = {
    id: {
        primary: true,
        type: 'number',
    },
    name: 'string',
    email: 'string',
    age: 'number',
    wrotePost: {
        type: "relationship",
        target: "Post",
        relationship: "WROTE",
        direction: "out"
    },
    likePost: {
        type: "relationship",
        target: "Post",
        relationship: "LIKED",
        direction: "out",
        properties: {
            rate: 'number',
            createdAt: 'date'
        }
    },
    wroteComment: {
        type: "relationship",
        target: "Comment",
        relationship: "WROTE",
        direction: "out"
    },
    likeComment: {
        type: "relationship",
        target: "Comment",
        relationship: "LIKED",
        direction: "out",
        properties: {
            rate: 'number',
            createdAt: 'date'
        }
    },
}