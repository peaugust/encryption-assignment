const express  = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));

app.post('/signup', (req, res) => {
    const {username, auth_token} = req.body;
    console.log(`${req.body.username}`);
    res.sendStatus(200);
})

app.post('/signin', (req, res) => {
    const {username, auth_token} = req.body;
    console.log(`${req.body.username}`);
    res.sendStatus(200); 
})

app.post('/store', (req, res) => {}) 