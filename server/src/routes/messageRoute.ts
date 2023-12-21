import express from 'express';
import { handleMessageRequest } from '../controllers/messageController';

const router = express.Router();

router.post('/', handleMessageRequest);

export default router;