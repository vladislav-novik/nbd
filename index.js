const Neode = require('neode')
const moment = require('moment')

const categories = require('./mocks/categories');
const tags = require('./mocks/tags');
const users = require('./mocks/users');
const posts = require('./mocks/posts');
const comments = require('./mocks/comments');

const instance = new Neode.fromEnv();
initializeDb();

async function initializeDb() {
    instance.with({
        User: require('./models/user'),
        Post: require('./models/post'),
        Comment: require('./models/comment'),
        Tag: require('./models/tag'),
        Category: require('./models/category')
    });

    await uploadNodes()
    console.log('Nodes were uploaded')

    await uploadRelations()
    console.log('Relations were uploaded')
}

async function uploadNodes() {
    for (let i = 0; i < categories.length; i++) {
        await instance.model('Category').create(categories[i]);
    }

    for (let i = 0; i < tags.length; i++) {
        await instance.model('Tag').create(tags[i]);
    }

    for (let i = 0; i < users.length; i++) {
        await instance.model('User').create(users[i]);
    }

    for (let i = 0; i < posts.length; i++) {
        posts[i].createdAt = new Date(posts[i].createdAt);
        await instance.model('Post').create(posts[i]);
    }

    for (let i = 0; i < comments.length; i++) {
        comments[i].createdAt = new Date(comments[i].createdAt);
        await instance.model('Comment').create(comments[i]);
    }
}

async function uploadRelations() {
    await isInRelation();
    console.log('Added isInRelation');

    await taggedRelation();
    console.log('Added taggedRelation')

    await wrotePostsRelation();
    console.log('Added wrotePostsRelation');

    await wroteCommentRelation();
    console.log('Added wroteCommentRelation');

    await commentedRelation();
    console.log('Added commentedRelation');

    await likedPostRelation();
    console.log('Added likedPostRelation');

    await likedCommentRelation();
    console.log('Added likedCommentRelation');
}

async function isInRelation() {
    const { length } = categories;

    for (let i = 0; i < posts.length; i++) {
        await instance.cypher(`MATCH (p:Post {id: {postId}}), (c:Category {id:{categoryId}}) 
            MERGE (p)-[:IS_IN]->(c)`, { postId: posts[i].id, categoryId: categories[randomNum(length - 1)].id })
    }
}

async function taggedRelation() {
    const { length } = tags;

    for (let i = 0; i < posts.length; i++) {

        let tagsAmount = randomNum(10)

        for (let j = 0; j < tagsAmount; j++) {
            await instance.cypher(`MATCH (p:Post {id: {postId}}), (t:Tag {id:{tagId}}) 
                MERGE (p)-[:TAGGED]->(t)`, { postId: posts[i].id, tagId: tags[randomNum(length - 1)].id })
        }
    }
}

async function wrotePostsRelation() {
    const { length } = users;

    for (let i = 0; i < posts.length; i++) {
        await instance.cypher(`MATCH (p:Post {id: {postId}}), (u:User {id:{userId}}) 
            MERGE (u)-[:WROTE]->(p)`, { postId: posts[i].id, userId: users[randomNum(length - 1)].id });
    }
}

async function wroteCommentRelation() {
    const { length } = users;

    for (let i = 0; i < comments.length; i++) {
        await instance.cypher(`MATCH (c:Comment {id: {commentId}}), (u:User {id:{userId}}) 
            MERGE (u)-[:WROTE]->(c)`, { commentId: comments[i].id, userId: users[randomNum(length - 1)].id });
    }
}

async function commentedRelation() {
    const { length } = posts;

    for (let i = 0; i < comments.length; i++) {
        await instance.cypher(`MATCH (c:Comment {id: {commentId}}), (p:Post {id:{postId}}) 
            MERGE (c)-[:COMMENTED]->(p)`, { commentId: comments[i].id, postId: posts[randomNum(length - 1)].id });
    }
}

async function likedPostRelation() {
    const { length: postsLength } = posts;
    const { length: usersLength } = users;

    for (let i = 0; i < 10000; i++) {
        await instance.cypher(`MATCH (p:Post {id: {postId}}), (u:User {id:{userId}}) 
            MERGE (u)-[:LIKED { rate: {rate}, createdAt: {createdAt} }]->(p)`, {
                postId: posts[randomNum(postsLength - 1)].id, 
                userId: users[randomNum(usersLength - 1)].id,
                rate: randomRate(),
                createdAt: randomDate(),
            });
    }
}

async function likedCommentRelation() {
    const { length: commentsLength } = comments;
    const { length: usersLength } = users;

    for (let i = 0; i < 10000; i++) {
        await instance.cypher(`MATCH (c:Comment {id: {commentId}}), (u:User {id:{userId}}) 
            MERGE (u)-[:LIKED { rate: {rate}, createdAt: {createdAt} }]->(c)`, {
                commentId: comments[randomNum(commentsLength - 1)].id, 
                userId: users[randomNum(usersLength - 1)].id,
                rate: randomRate(),
                createdAt: randomDate(),
            });
    }
}

function randomNum(max, min = 1) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomRate(max = 5, min = 0) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomDate(start, end) {
    if (!start) {
        start = new Date();
        start.setFullYear(start.getFullYear() - 1);
    }

    if (!end) {
        end = new Date();
    }

    return moment(new Date(start.getTime() + Math.round(Math.random() * (end.getTime() - start.getTime())))).format('YYYY-MM-DD');
}
