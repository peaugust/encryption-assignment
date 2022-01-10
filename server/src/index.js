import express from 'express'
import {setupDb, db} from './db/db.js'

(() => {
    console.log(Object.keys(db))
    try {
        setupDb()
    } catch (err) {
        console.log('DEU ERRO', err)
    }
})()

const app = express()
const PORT = 8080;

app.use(express.json())

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`))

app.post('/signup', async (req, res) => {
    try {
        const {username, auth_token} = req.body;
        console.log(username, auth_token)
        const a = await db['User'].create({email: username, authKey: auth_token})
        res.status(200).json(req.body);
    } catch (err) {
        res.status(400).json({"error": `Something went wrong!!!! ${err}`})
    }
})

app.post('/signin', async (req, res) => {
    try {
        const {username, auth_token} = req.body;
        const user = await db['User'].findAll({where: {
            email: username,
            authKey: auth_token
        }})
        console.log('USER', user)
        if(user.length > 0) {
            res.status(200).json(req.body);
        } else {
            throw new Error
        }
    } catch (err) {
        res.status(400).json({"error": `Something went wrong!!!! ${err}`})
    }
})

app.post('/upload-data', async (req, res) => {
    try {
        const {encrypted_data} = req.body;
        console.log('Data', encrypted_data)
    } catch (err) {
        res.status(400).json({"error": `Something went wrong!!!! ${err}`})
    }
})

app.post('/store', (req, res) => {}) 

export default app