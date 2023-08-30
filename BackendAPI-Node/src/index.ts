import express from "express";
import cors from 'cors'
import promptRouter from "./routes/prompt/promptRoutes.js";
import tuneRouter from "./routes/finetune/finetuneRoutes.js";
import { config } from "dotenv";

config();
const server = express();
server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.json()); 

// Entry point Route - "/"
server.get("/", (req : Request, res : any) => {
    res.json("HF Runtime Containers - Backend API service : Operational");
})

// RESTful routes
server.use("/api/prompt", promptRouter)
server.use("/api/fine-tune", tuneRouter)

server.use((req, res: any, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Pass to next layer of middleware
    if (req.method === 'OPTIONS') res.sendStatus(200);
    else next();
});

server.listen(4000, () => {
    console.log("server is listening on port 4000");
})