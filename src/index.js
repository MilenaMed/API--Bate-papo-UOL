import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express()
app.use(cors())

//Mongo
let db
const mongoClient = new MongoClient(process.env.DATABASE_URL)
mongoClient.connect()
.then(()=> db = mongoClient.db())
.catch((err) => console.log(err.message))

app.listen(5000)