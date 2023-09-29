import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});


// Load environment variables
dotenv.config();

app.use(express.json());

app.post('/api/chat', (req, res) => {
  const userMessage = req.body.message;
  // Handle user message and get response from API
  // For demonstration, echoing the user message
  const botResponse = `You said: ${userMessage}`;
  res.json({ response: botResponse });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
