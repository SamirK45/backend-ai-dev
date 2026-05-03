import express from "express";
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import connect from "./db/db.js";
import cookieParser from "cookie-parser"
import cors from 'cors'
import aiRoutes from './routes/ai.routes.js'
import messageRoutes from './routes/message.routes.js';

const app = express()
app.set('trust proxy', 1);
connect()
app.use(cors())
app.use(morgan('dev'))
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