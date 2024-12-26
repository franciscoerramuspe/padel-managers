import express from 'express';
import { tournamentService } from '../services/tournaments.js';
import { tournamentDrawService } from '../services/tournament-draw.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const filters = {
    startDate: req.query.startDate,
    endDate: req.query.endDate
  };

  const { data, error } = await tournamentService.getTournaments(filters);
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.json(data);
});

router.post('/', async (req, res) => {
  const { data, error } = await tournamentService.createTournament(req.body);
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.status(201).json(data);
});

router.post('/:id/draw', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await tournamentDrawService.createDraw(id);
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.status(201).json(data);
});

router.get('/:id/draw', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await tournamentDrawService.getDraw(id);
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.json(data);
});

router.get('/:id/draw/test', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await tournamentDrawService.testDraw(id);
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.json(data);
});

export default router; 