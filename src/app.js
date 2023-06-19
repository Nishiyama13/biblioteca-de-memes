import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

//Criação do servidor
const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()

//Configurações do banco de dados
let db;
const mongoClient = new MongoClient(process.env.DATABASE_URL) //se não existir vai ser criado
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))

//Endpoints
app.post("/memes", (req, res) => {
    const { description, image, category } = req.body

    if (!description || !image || !category) {
        return res.status(422).send("Todos os dados devem ser inseridos obrigatóriamente!")
    }

    const newMeme = { description, image, category }
    db.collection("memes").insertOne(newMeme)
        .then(() => res.sendStatus(201))
        .catch((err) => res.status(500).send(err.message))

})

app.get("/memes", (req, res) => {
    db.collection("memes").find().toArray()
    .then(memes => res.send(memes)) 
    .catch(err => res.status(500).send(err.message))
})

//Deixa o app aguardando uma requisição
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodado na porta ${PORT}`));