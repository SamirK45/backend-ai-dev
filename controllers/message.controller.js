import * as messageService from '../services/message.service.js';

export const saveMessage = async (req, res) => {
  try {
    const { projectId, messages, type,sender } = req.body;
    console.log(" req body " , req.body);
    console.log("sender email - " , req.body.sender);
    const message = await messageService.saveMessage({
      projectId,
      messages,
      sender, // Using authenticated user's email from req.user
      type
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const messages = await messageService.getProjectMessages({ projectId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};