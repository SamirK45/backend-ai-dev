import express from "express";
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import connect from "./db/db.js";
import cookieParser from "cookie-parser"
import cors from 'cors'
import aiRoutes from './routes/ai.routes.js'
import messageRoutes from './routes/message.routes.js';
import config from './config/config.js';

const app = express()
app.set('trust proxy', config.server.trustProxy);
connect()
app.use(cors({
    origin: config.cors.origin,
    methods: config.cors.methods,
    credentials: config.cors.credentials,
}))
app.use(morgan(config.logging.format))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/users', userRoutes);
app.use(cookieParser())
app.use('/projects', projectRoutes);
app.use('/ai',aiRoutes)
app.use('/messages', messageRoutes);

app.get("/", (req, res) => {
    res.send("Hello World")
})

export default app