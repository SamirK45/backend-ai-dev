import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from './models/project.model.js';
import {generateContent}  from "./services/gemini.service.js";

dotenv.config()
const PORT = process.env.PORT || 3000

const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: '*',
    }
});

io.use(async (socket, next) => {
   try {

         const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
         const projectId=  socket.handshake.query.projectId;
         if (!mongoose.Types.ObjectId.isValid(projectId)) {
              return next(new Error("Invalid project ID"));
         }

         socket.project = await projectModel.findById(projectId);
         
         if (!token) {
              return next(new Error("Authentication error"));
         }

           
         const user = jwt.verify(token, process.env.JWT_SECRET);
         if (!user) {
              return next(new Error("Authentication error"));
         }
         socket.user = user;
         next();
    
   } catch (error) {
       next(error);
    
   }
});

io.on('connection', socket => {

      socket.roomId = socket.project._id.toString();
    console.log('a user connected');
    socket.join(socket.roomId);

    socket.on('project-message',async data => {

        const message = data.messages;
        console.log("message "+message);

        const aiPresentInMessage = message.includes('@ai');
        console.log("aimessage " + aiPresentInMessage);
        socket.broadcast.to(socket.roomId).emit('project-message', data);

        if (aiPresentInMessage) {
            
            const prompt = message.replace('@ai','')

            try {
              const result = await generateContent(prompt)
              console.log("AI result:", result);
              
              io.to(socket.roomId).emit('project-message',{
                
                messages: result,
                sender:{
                    _id:"ai",
                    email:"AI BOT"
                }
              })
            } catch (error) {
              console.error("AI generation error:", error);
              io.to(socket.roomId).emit('project-message',{
                messages: JSON.stringify({ text: "Sorry, I encountered an error. Please try again." }),
                sender:{
                    _id:"ai",
                    email:"AI BOT"
                }
              })
            }

            return
        }
    })  

    socket.on('event', data => { /* … */ });
    socket.on('disconnect', () => { 

        console.log("user disconnected")
        socket.leave(socket.roomId)
         });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


