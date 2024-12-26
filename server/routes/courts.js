import express from 'express';
import { courtService } from '../services/courts.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { data, error } = await courtService.getCourts();
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.json(data);
});

router.post('/', async (req, res) => {
  const { data, error } = await courtService.createCourt(req.body);
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.status(201).json(data);
});

export default router; 