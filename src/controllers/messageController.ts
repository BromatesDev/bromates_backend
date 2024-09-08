import express from 'express';
import MessageModel from '../models/message';
import UserModel from '../models/users';

const router = express.Router();

// Endpoint to send a message
router.post('/', async (req, res) => {
  const { senderId, recipientId, content } = req.body;

  try {
    const message = new MessageModel({
      sender: senderId,
      recipient: recipientId,
      content,
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Endpoint to get messages between two users
router.get('/:userId1/:userId2', async (req, res) => {
  const { userId1, userId2 } = req.params;

  try {
    const messages = await MessageModel.find({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
