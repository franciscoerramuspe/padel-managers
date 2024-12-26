import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tournamentsRouter from './routes/tournaments.js';
import courtsRouter from './routes/courts.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tournaments', tournamentsRouter);
app.use('/api/courts', courtsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 