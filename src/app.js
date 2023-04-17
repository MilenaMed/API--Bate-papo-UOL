import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import dayjs from "dayjs";
import { participantes, mensagem } from "./schemas.js";

const app = express();

//Ferramentas
app.use(cors())
app.use(express.json())
dotenv.config()

//Mongo
const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
    mongoClient.connect()
    db = mongoClient.db()
}
catch (err) {
    console.log(err.message)
}

//POST - PARTICIPANTS

app.post("/participants", async (request, response) => {

    const usuario = request.body;
    const validacao = participantes.validate(usuario);
    if (validacao.error) {
        return response.sendStatus(422)
    }

    //Novo usúario
    const nomeExiste = await db.collection("participants").findOne({ name: usuario })
console.log(usuario.name)
    if (nomeExiste) {
        return response.status(409).send("Nome de usuário em uso")
    }
    try {
        await db.collection("participants").insertOne({
            name: usuario.name,
            lastStatus: Date.now()
        })

        await db.collection("messages").insertOne({
            from: usuario.name,
            to: "Todos",
            text: "entra na sala...",
            type: "status",
            time: dayjs(Date.now()).format('HH:mm:ss')
        })
        response.sendStatus(201)

    } catch (err) {
        return response.status(500).send(err.message)
    }
})

// GET - PARTICIPANTS
app.get('/participants', async (request, response) => {
    const usuarios = await db.collection("participants").find().toArray()
    return response.status(200).send(usuarios)
})

// POST - MESSAGES
app.post("messages", async (request, response) => {
    const mensagemEnviada = request.body;

    const validacaomensagem = mensagem.validate(mensagemEnviada)

    if (validacaomensagem.error) {
        return response.sendStatus(422)
    }

    const nomeExiste = await db.collection("participants").findOne({ name: usuario })

    if (!nomeExiste) {
        return response.status(422).send("Nome de usuário não encontrado")
    }
})

//GET - MESSAGES
app.get('/messages', async (request, response) => {
    const limite = request.query.limit
    const limiteMax = parseInt(limite)

    try {
        if (limit) {
            if (limiteMax <= 0 || isNaN(limit)) {
                return res.sendStatus(422)
            }

            const usuario = request.headers.user
            const mensagens = await db.collection("messages").find({$or: [
                {to: "Todos"}, 
                {to: usuario}, 
                {from: usuario},
                { type: "message" }
            ]}).toArray();

            return response.send([...mensagens].slice(-limit).reverse())
        }
        return response.sendStatus(200).send([...mensagens].reverse())
    } catch(err) {
        return response.sendStatus(422).send("Erro: Não foi possível pegar mensagens")
    }
})

//POST- STATUS
app.listen(5000);