import { Router } from 'express'
import { createLeague, joinLeague, getLeaguesByUser, getLeagueById, getAllLeagues, generateStandings, getStandings, getStandingById, updateMatchResult, updateMatchSchedule, getMatchesByUserId, getMatchesByRound } from '../controllers/league.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { verifyAdmin } from '../middlewares/admin.middleware.js'

const router = Router()

router.post('/createLeague', verifyToken, verifyAdmin, createLeague)
router.get('/all', verifyToken, getAllLeagues);
router.get('/byId/:id', verifyToken, getLeagueById);
router.get('/user/:userId', verifyToken, getLeaguesByUser);
router.get('/matches/user/:userId', verifyToken, getMatchesByUserId);
router.get('/matches/:leagueId', verifyToken, getMatchesByRound);
router.post('/join', verifyToken, joinLeague);
router.post('/generateStandings/:uuid', generateStandings);
router.get('/standings/:league_id', verifyToken, getStandings);
router.get('/standing/:id', verifyToken, getStandingById);
router.post('/match/result/:id', updateMatchResult);
router.put('/match/schedule/:id', verifyToken, verifyAdmin, updateMatchSchedule);

export default router 