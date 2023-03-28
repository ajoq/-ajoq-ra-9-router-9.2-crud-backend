import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(
    bodyParser.json({
        type(req) {
            return true;
        },
    })
);
app.use(function (req, res, next) {
    res.setHeader("Permissions-Policy", "interest-cohort=()");
    res.setHeader("Content-Type", "application/json");
    next();
});

let posts = [
    { id: 0, content: "Тут какой-то умный пост", created: 1679915933225 },
    { id: 1, content: "Здесь что-то про политику", created: 1679915933236 },
    { id: 2, content: "Пост про котиков", created: 1679915933281 },
];
let nextId = 3;

app.get("/posts", (req, res) => {
    res.send(JSON.stringify(posts));
});

app.get("/posts/:id", (req, res) => {
    const postId = Number(req.params.id);
    const index = posts.findIndex((o) => o.id === postId);
    res.send(JSON.stringify({ post: posts[index] }));
});

app.post("/posts", (req, res) => {
    const { id, content } = req.body;

    if (id === 0) {
        posts.push({ id: nextId++, created: Date.now(), content });
        res.status(204);
        res.end();
        return;
    }

    posts.find((post) => {
        if (post.id === +id) {
            post.content = content;
        }
    });

    res.status(204);
    res.end();
});

app.delete("/posts/:id", (req, res) => {
    const postId = Number(req.params.id);
    const index = posts.findIndex((o) => o.id === postId);
    if (index !== -1) {
        posts.splice(index, 1);
    }
    res.status(204);
    res.end();
});

const port = process.env.PORT || 7070;
app.listen(port, () => console.log(`The server is running on port ${port}.`));
