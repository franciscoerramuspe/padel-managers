import { Router } from 'express'
import { createLeague, joinLeague, getLeaguesByUser, getLeagueById, getAllLeagues, generateStandings, getStandings, getStandingById, updateMatchResult, updateMatchSchedule, getMatchesByUserId, getMatchesByRound, getMatchesByLeague, removeTeamFromLeague } from '../controllers/league.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { verifyAdmin } from '../middlewares/admin.middleware.js'

const router = Router()

// Add CORS headers
router.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

router.post('/createLeague', verifyToken, verifyAdmin, createLeague)
router.get('/all', verifyToken, getAllLeagues);
router.get('/byId/:id', verifyToken, getLeagueById);
router.get('/user/:userId', verifyToken, getLeaguesByUser);
router.get('/matches/user/:userId', verifyToken, getMatchesByUserId);
router.get('/matches/round/:leagueId', verifyToken, getMatchesByRound);
router.get('/matches/league/:leagueId', getMatchesByLeague);
router.post('/join', verifyToken, joinLeague);
router.post('/generateStandings/:uuid', verifyToken, verifyAdmin, generateStandings);
router.get('/standings/:league_id', verifyToken, getStandings);
router.get('/standing/:id', verifyToken, getStandingById);
router.post('/match/result/:id', updateMatchResult);
router.put('/match/schedule/:id', verifyToken, verifyAdmin, updateMatchSchedule);
router.delete('/remove-team', verifyToken, verifyAdmin, removeTeamFromLeague);

export default router 