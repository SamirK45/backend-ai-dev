import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "project"
  },
  messages: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true,
   
    
  },
  type: {
    type: String,
    enum: ['incoming', 'outgoing'],
    required: true
  }
}, { timestamps: true });

const Message = mongoose.model("message", messageSchema);
export default Message;