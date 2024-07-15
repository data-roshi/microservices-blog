const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) =>{
   return res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const postId = req.params.id;
    const comments = commentsByPostId[postId] || [];
    const comment = {
        id: commentId,
        content,
        status: 'pending'
    };
    comments.push(comment);
    commentsByPostId[postId] = comments;


    await postEvent('CommentCreated', {
        ...comment,
        postId
    });

    return res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        const { postId, id, status } = data;
        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => comment.id === id);
        comment.status = status;

        await postEvent('CommentUpdated', {
            ...comment,
            postId
        });
    }

    res.send({});
});

async function postEvent(type, data) {
    await axios.post('http://localhost:4005/events', {
        type,
        data
    });
}
app.listen(4001, () => {
    console.log('Listening on 4001');
});