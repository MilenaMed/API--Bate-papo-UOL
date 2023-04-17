import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv"
import dayjs from "dayjs"

const app = express();

//Ferramentas
app.use(cors())
app.use(express.json())
dotenv.config()

//Mongo
const mongoClient = new MongoClient(process.env.DATABASE_URL)
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))

//POST - PARTICIPANTS

app.post("/participants", async (request, response) => {
    const usuario = request.body

    //VALIDAÇÃO
    const validacao = schemas.participants.validate(usuario)
    if (validacao.err) {
        return response.sendStatus(422)
    }

    //Novo usúario
    const nomeExiste = await dbcollection("participants").findOne({ nome: usuario })
    if (nomeExiste) {
        return response.status(409).send("Nome de usuário em uso")
    }
    try {
        await db.collection("participants").insertOne({
            name: usuario,
            lastStatus: Date.now()
        })

        await db.collection("messages").insertOne({
            from: usuario,
            to: "Todos",
            text: "entra na sala...",
            type: "status",
            time: dayjs().format('HH:mm:ss')
        })
        response.sendStatus(201)

    } catch (err) {
        return res.sendStatus(500).send(err.message)
    }
})

// GET - PARTICIPANTS

// POST - MESSAGES

//GET - MESSAGES

//POST/ STATUS

app.listen(5000);