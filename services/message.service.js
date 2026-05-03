import messageModel from '../models/message.model.js';

export const saveMessage = async ({ projectId, messages, sender, type }) => {
    console.log("type - " , type);
  try {

  
    const message = new messageModel({
      projectId,
      messages,
      sender,
      type
    });

    console.log("message - " , message);
    await message.save();
    return message;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getProjectMessages = async ({ projectId }) => {
  try {
    const messages = await messageModel.find({ projectId })
      .populate('sender', 'email')
      .sort({ createdAt: 1 });
    return messages;
  } catch (error) {
    throw new Error(error.message);
  }
};