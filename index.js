const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vbld0.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const postCollection = client.db("retroTech").collection("post");

    // Admin Login 

    app.post("/login", (req, res) => {
        const defaultEmail = "test@test.com"
        const defaultPassword = "#2021dev"

        const { email, password } = req.body

        if (email === defaultEmail && password === defaultPassword) {
            return res.status(200).json({ user: { name: "something" } })
        }

        return res.status(400).json({
            message: "Invalid Email or Password"
        })
    })

    // add new Post API
    app.post('/addPost', (req, res) => {
        const post = req.body;
        postCollection.insertOne(post)
            .then(result => {
                res.send(result.insertedCount)
            })
    })

    // all Post API
    app.get('/post', (req, res) => {
        postCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // single Post API
    app.get('/post/:id', (req, res) => {
        postCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // Delete Post API
    app.delete('/delete/:id', (req, res) => {
        postCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })
});




app.get('/', (req, res) => {
    res.send('Server Working...')
})
app.listen(process.env.PORT || port);