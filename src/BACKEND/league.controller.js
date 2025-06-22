import { supabase } from '../config/supabaseClient.js'

const LEAGUE_STATUS = {
  INSCRIBIENDO: 'Inscribiendo',
  ACTIVA: 'Activa',
  FINALIZADA: 'Finalizada'
};

export async function createLeague(req, res) {
  const { 
    name, 
    categories, 
    start_date, 
    end_date, 
    courts_available = 2,
    time_slots, 
    team_size, 
    inscription_cost 
  } = req.body;

  // Validaciones
  if (!name || !Array.isArray(categories) || categories.length === 0) {
    return res.status(400).json({ 
      message: 'Nombre de la liga y al menos una categoría son requeridos' 
    });
  }
  if (courts_available < 1) {
    return res.status(400).json({
      message: 'El numero de canchas disponibles debe ser mayor a 0'
    });
  }
  if (team_size < 1) {
    return res.status(400).json({
      message: 'El numero de equipos registrables debe ser mayor a 0'
    });
  }
  if (!Array.isArray(time_slots)) {
    return res.status(400).json({
      message: 'Los horarios deben ser un array de rangos'
    });
  }
  for (const slot of time_slots) {
    if (!Array.isArray(slot) || slot.length !== 2 || !Number.isInteger(slot[0]) || !Number.isInteger(slot[1])) {
      return res.status(400).json({
        message: 'Cada rango debe ser un array de dos números enteros'
      });
    }
    const [start, end] = slot;
    if (start < 0 || start > 24 || end < 0 || end > 24 || end <= start) {
      return res.status(400).json({
        message: 'Los horarios deben ser válidos (inicio < fin, entre 0 y 24)'
      });
    }
  }
  if (typeof inscription_cost !== 'number' || isNaN(inscription_cost)) {
    return res.status(400).json({ message: 'El campo inscription_cost debe ser un número.' });
  }

  // Crear una liga por cada categoría
  const leaguesToCreate = categories.map(category_id => ({
    name,
    category_id,
    start_date,
    end_date,
    status: LEAGUE_STATUS.INSCRIBIENDO,
    courts_available,
    team_size,
    time_slots,
    inscription_cost
  }));

  const { data, error } = await supabase
    .from('leagues')
    .insert(leaguesToCreate)
    .select();

  if (error) {
    console.error('Error creando ligas:', error);
    return res.status(500).json({ message: error.message });
  }

  res.status(201).json({
    message: 'Ligas creadas exitosamente',
    ligas: data
  });
}

export async function getLeaguesByUser(req, res) {
  const user_id = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: teams, error: teamsError } = await supabase
    .from('teams')
    .select('id')
    .or(`player1_id.eq.${user_id},player2_id.eq.${user_id}`);

  if (teamsError) {
    return res.status(500).json({ message: teamsError.message });
  }
  if (!teams.length) {
    return res.status(200).json({ leagues: [], page, pageSize, total: 0 });
  }

  const teamIds = teams.map(team => team.id);

  const { data: leagueTeams, error: leagueTeamsError } = await supabase
    .from('league_teams')
    .select('league_id')
    .in('team_id', teamIds);

  if (leagueTeamsError) {
    return res.status(500).json({ message: leagueTeamsError.message });
  }
  if (!leagueTeams.length) {
    return res.status(200).json({ leagues: [], page, pageSize, total: 0 });
  }

  const leagueIds = leagueTeams.map(lt => lt.league_id);

  const { data: leagues, error: leaguesError, count } = await supabase
    .from('leagues')
    .select('*', { count: 'exact' })
    .in('id', leagueIds)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (leaguesError) {
    return res.status(500).json({ message: leaguesError.message });
  }

  res.status(200).json({
    leagues,
    page,
    pageSize,
    total: count
  });
}

export async function getAllLeagues(req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Primero obtenemos las ligas
  const { data, error, count } = await supabase
    .from('leagues')
    .select('*, category:category_id(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  // Obtener la cantidad de equipos registrados por liga
  const leagueIds = data.map(l => l.id);
  const { data: teamsData, error: teamsError } = await supabase
    .from('league_teams')
    .select('league_id')
    .in('league_id', leagueIds);

  if (teamsError) {
    return res.status(500).json({ message: teamsError.message });
  }

  // Contar equipos por liga
  const teamsCount = teamsData.reduce((acc, team) => {
    acc[team.league_id] = (acc[team.league_id] || 0) + 1;
    return acc;
  }, {});

  // Agregar el conteo a cada liga
  const leaguesWithRegistered = data.map(league => ({
    ...league,
    registeredTeams: teamsCount[league.id] || 0
  }));

  res.status(200).json({
    leagues: leaguesWithRegistered,
    page,
    pageSize,
    total: count
  });
}

export async function getLeagueById(req, res) {
  const { id } = req.params;

  // Obtener la información básica de la liga
  const { data: league, error: leagueError } = await supabase
    .from('leagues')
    .select('*, category:category_id(*)')
    .eq('id', id)
    .single();

  if (leagueError) {
    return res.status(500).json({ message: leagueError.message });
  }
  if (!league) {
    return res.status(404).json({ message: 'Liga no encontrada' });
  }

  // Obtener los equipos registrados y sus jugadores
  const { data: leagueTeams, error: teamsError } = await supabase
    .from('league_teams')
    .select(`
      id,
      team:team_id (
        id,
        player1:player1_id (
          id,
          first_name,
          last_name
        ),
        player2:player2_id (
          id,
          first_name,
          last_name
        )
      )
    `)
    .eq('league_id', id);

  if (teamsError) {
    return res.status(500).json({ message: teamsError.message });
  }

  // Formatear los equipos para una mejor respuesta
  const registeredTeams = leagueTeams.map(lt => ({
    id: lt.team.id,
    player1: {
      id: lt.team.player1.id,
      name: `${lt.team.player1.first_name} ${lt.team.player1.last_name}`
    },
    player2: {
      id: lt.team.player2.id,
      name: `${lt.team.player2.first_name} ${lt.team.player2.last_name}`
    }
  }));

  res.status(200).json({
    ...league,
    registeredTeams: registeredTeams.length,
    teams: registeredTeams
  });
}

export async function joinLeague(req, res) {
  const { league_id, player1_id, player2_id } = req.body;

  // Validar que se proporcionen ambos jugadores
  if (!player1_id || !player2_id) {
    return res.status(400).json({ message: 'Se requieren ambos jugadores para crear o encontrar el equipo' });
  }

  // Validar que los jugadores sean diferentes
  if (player1_id === player2_id) {
    return res.status(400).json({ message: 'Los jugadores deben ser diferentes' });
  }

  console.log('To get League');
  const { data: league, error: leagueError } = await supabase
    .from('leagues')
    .select('id, status, team_size')
    .eq('id', league_id)
    .single();

  if (leagueError || !league) {
    return res.status(404).json({ message: 'Liga no encontrada' });
  }
  if (league.status !== LEAGUE_STATUS.INSCRIBIENDO) {
    return res.status(400).json({ message: 'La liga no está abierta para inscripciones' });
  }

  console.log('To Find or Create Team');
  // Buscar si el equipo ya existe (considerando ambos órdenes de jugadores)
  let team = null;
  const { data: existingTeam, error: findTeamError } = await supabase
    .from('teams')
    .select('id')
    .or(`and(player1_id.eq.${player1_id},player2_id.eq.${player2_id}),and(player1_id.eq.${player2_id},player2_id.eq.${player1_id})`)
    .single();

  if (findTeamError && findTeamError.code !== 'PGRST116') { // PGRST116 means No rows found
    console.error('Error finding team:', findTeamError);
    return res.status(500).json({ message: 'Error buscando equipo existente' });
  }

  if (existingTeam) {
    console.log('Existing team found:', existingTeam);
    team = existingTeam;
  } else {
    console.log('No existing team found, creating new team');
    // Crear el equipo si no existe
    const { data: newTeam, error: createTeamError } = await supabase
      .from('teams')
      .insert({
        player1_id,
        player2_id
      })
      .select()
      .single();

    if (createTeamError) {
      console.error('Error creating team:', createTeamError);
      return res.status(500).json({ message: 'Error creando el equipo' });
    }
    team = newTeam;
    console.log('New team created:', team);
  }

  console.log('To Verify team in league');
  // Verificar si el equipo (encontrado o creado) ya está inscrito en la liga
  const { data: existingLeagueTeam, error: existingLeagueTeamError } = await supabase
    .from('league_teams')
    .select('id')
    .eq('league_id', league_id)
    .eq('team_id', team.id)
    .maybeSingle();

  if (existingLeagueTeamError) {
    console.error('Error validating previous inscription:', existingLeagueTeamError);
    return res.status(500).json({ message: 'Error validando inscripción previa' });
  }
  if (existingLeagueTeam) {
    return res.status(400).json({ message: 'El equipo ya está inscrito en esta liga' });
  }

  console.log('To count teams');
  // Contar equipos actuales en la liga
  const { count: currentCount, error: countError } = await supabase
    .from('league_teams')
    .select('id', { count: 'exact', head: true })
    .eq('league_id', league_id);

  if (countError) {
    console.error('Error counting enrolled teams:', countError);
    return res.status(500).json({ message: 'Error contando equipos inscritos' });
  }
  if (currentCount >= league.team_size) {
    return res.status(400).json({ message: 'La liga ya está llena' });
  }

  console.log('To insert league team');
  // Inscribir el equipo en la liga
  const { data: leagueTeam, error: joinError } = await supabase
    .from('league_teams')
    .insert({ league_id, team_id: team.id })
    .select()
    .single();

  if (joinError) {
    console.error('Error enrolling team:', joinError);
    return res.status(500).json({ message: 'Error inscribiendo el equipo' });
  }

  console.log('To update state');
  // Si la liga se llena, actualizar su estado
  if (currentCount + 1 === league.team_size) {
    await supabase
      .from('leagues')
      .update({ status: LEAGUE_STATUS.ACTIVA })
      .eq('id', league_id);
  }

  res.status(201).json({
    message: 'Equipo encontrado/creado e inscrito exitosamente en la liga',
    team,
    league_team: leagueTeam
  });
}

export async function generateStandings(req, res) {
  const league_id = req.params.uuid;
  const rounds = parseInt(req.body.rounds) || 1;

  if (rounds !== 1 && rounds !== 2) {
    return res.status(400).json({ message: 'El número de rondas debe ser 1 o 2' });
  }

  // Verificar si ya existen standings para esta liga
  const { data: existingStandings, error: checkStandingsError } = await supabase
    .from('league_standings')
    .select('id')
    .eq('league_id', league_id)
    .limit(1);

  if (checkStandingsError) {
    console.error('Error al verificar standings existentes:', checkStandingsError);
    return res.status(500).json({ message: checkStandingsError.message });
  }

  if (existingStandings && existingStandings.length > 0) {
    return res.status(409).json({ message: 'Los standings y partidos para esta liga ya han sido generados.' });
  }

  const { data: league, error: leagueError } = await supabase
    .from('leagues')
    .select('*, category:category_id(*)')
    .eq('id', league_id)
    .single();

  if (leagueError || !league) {
    return res.status(404).json({ message: 'Liga no encontrada' });
  }

  const { data: leagueTeams, error: teamsError } = await supabase
    .from('league_teams')
    .select('id, team_id')
    .eq('league_id', league_id);

  if (teamsError) {
    return res.status(500).json({ message: teamsError.message });
  }
  if (!leagueTeams.length) {
    return res.status(400).json({ message: 'No hay equipos inscritos en la liga' });
  }

  const leagueTeamIdMap = new Map();
  leagueTeams.forEach(lt => {
    leagueTeamIdMap.set(lt.team_id, lt.id);
  });

  const teamIds = leagueTeams.map(lt => lt.team_id);

  // Crear standings iniciales
  const standings = teamIds.map(team_id => ({
    league_id,
    team_id,
    points: 0,
    wins: 0,
    losses: 0,
    sets_won: 0,
    sets_lost: 0,
    games_played: 0,
    games_won: 0,
    games_lost: 0,
    sets_difference: 0,
    sets_in_favor: 0,
    sets_against: 0
  }));

  const { error: standingsError } = await supabase
    .from('league_standings')
    .insert(standings);

  if (standingsError) {
    return res.status(500).json({ message: standingsError.message });
  }

  // Extraer play_day y play_time de league.category
  const playDay = league.category.play_day;
  const playTime = league.category.play_time;
  const leagueStartDate = league.start_date;

  if (!playDay || !playTime) {
    return res.status(400).json({ message: 'La categoría de la liga debe tener un día y hora de juego definidos.' });
  }

  // Función para formatear la hora
  function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  // Implementación del algoritmo Round Robin
  function generateRoundRobinSchedule(teams) {
    const n = teams.length;
    if (n % 2 !== 0) {
      teams.push(null); // Añadir un equipo "fantasma" si el número es impar
    }

    const rounds = [];
    const numRounds = n - 1;
    const halfSize = n / 2;

    for (let round = 0; round < numRounds; round++) {
      const roundMatches = [];
      for (let i = 0; i < halfSize; i++) {
        const team1 = teams[i];
        const team2 = teams[n - 1 - i];
        if (team1 !== null && team2 !== null) {
          roundMatches.push([team1, team2]);
        }
      }
      rounds.push(roundMatches);

      // Rotar los equipos (excepto el primero)
      teams.splice(1, 0, teams.pop());
    }

    return rounds;
  }

  // Generar el calendario
  const schedule = generateRoundRobinSchedule([...teamIds]);
  
  // Preparar las fechas y horarios
  let currentMatchDate = getNextDayOccurrence(leagueStartDate, playDay, false);
  let currentMatchTime = formatTime(playTime);
  const TIME_INCREMENT_HOURS = 1;
  const matches = [];
  let matchNumber = 1;

  // Generar los partidos para cada ronda
  schedule.forEach((round, roundIndex) => {
    round.forEach(([team1Id, team2Id]) => {
      const leagueTeam1Id = leagueTeamIdMap.get(team1Id);
      const leagueTeam2Id = leagueTeamIdMap.get(team2Id);

      matches.push({
        league_id,
        league_team1_id: leagueTeam1Id,
        league_team2_id: leagueTeam2Id,
        team1_sets1_won: 0,
        team2_sets1_won: 0,
        team1_sets2_won: 0,
        team2_sets2_won: 0,
        team1_tie1_won: 0,
        team2_tie1_won: 0,
        team1_tie2_won: 0,
        team2_tie2_won: 0,
        team1_tie3_won: 0,
        team2_tie3_won: 0,
        winner_league_team_id: null,
        match_date: `${currentMatchDate}T${currentMatchTime}`,
        status: 'SCHEDULED',
        walkover: false,
        walkover_team_id: null,
        match_number: matchNumber,
        category_id: league.category_id
      });

      // Actualizar la hora para el próximo partido del mismo día
      currentMatchTime = addHoursToTime(currentMatchTime, TIME_INCREMENT_HOURS);
    });

    // Si es la segunda ronda, generar los partidos de vuelta
    if (rounds === 2) {
      round.forEach(([team1Id, team2Id]) => {
        const leagueTeam1Id = leagueTeamIdMap.get(team1Id);
        const leagueTeam2Id = leagueTeamIdMap.get(team2Id);

        matches.push({
          league_id,
          league_team1_id: leagueTeam2Id, // Invertir el orden para la vuelta
          league_team2_id: leagueTeam1Id,
          team1_sets1_won: 0,
          team2_sets1_won: 0,
          team1_sets2_won: 0,
          team2_sets2_won: 0,
          team1_tie1_won: 0,
          team2_tie1_won: 0,
          team1_tie2_won: 0,
          team2_tie2_won: 0,
          team1_tie3_won: 0,
          team2_tie3_won: 0,
          winner_league_team_id: null,
          match_date: `${currentMatchDate}T${currentMatchTime}`,
          status: 'SCHEDULED',
          walkover: false,
          walkover_team_id: null,
          match_number: matchNumber,
          category_id: league.category_id
        });

        currentMatchTime = addHoursToTime(currentMatchTime, TIME_INCREMENT_HOURS);
      });
    }

    // Actualizar la fecha para la próxima ronda
    currentMatchDate = getNextDayOccurrence(currentMatchDate, playDay, true);
    currentMatchTime = formatTime(playTime);
    matchNumber++;
  });

  const { error: matchesError } = await supabase
    .from('league_matches')
    .insert(matches);

  if (matchesError) {
    return res.status(500).json({ message: matchesError.message });
  }

  const { error: updateError } = await supabase
    .from('leagues')
    .update({ status: LEAGUE_STATUS.ACTIVA })
    .eq('id', league_id);

  if (updateError) {
    return res.status(500).json({ message: updateError.message });
  }

  res.status(200).json({
    message: 'Standings y partidos generados exitosamente',
    standings,
    matches
  });
}

export async function getStandings(req, res) {
  const league_id = req.params.league_id;

  const { data, error } = await supabase
    .from('league_standings')
    .select('*')
    .eq('league_id', league_id)
    .order('points', { ascending: false });

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(200).json({ standings: data });
}

export async function getStandingById(req, res) {
  const id = req.params.id;

  const { data, error } = await supabase
    .from('league_standings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  if (!data) {
    return res.status(404).json({ message: 'Standing no encontrado' });
  }

  res.status(200).json({ standing: data });
}

export async function updateMatchResult(req, res) {
  const match_id = req.params.id;
  const { 
    team1_sets1_won, 
    team2_sets1_won,
    team1_sets2_won,
    team2_sets2_won,
    team1_tie1_won,
    team2_tie1_won,
    team1_tie2_won,
    team2_tie2_won,
    team1_tie3_won,
    team2_tie3_won
  } = req.body;

  // Validar que los sets sean obligatorios
  if (typeof team1_sets1_won !== 'number' || typeof team2_sets1_won !== 'number' ||
      typeof team1_sets2_won !== 'number' || typeof team2_sets2_won !== 'number') {
    return res.status(400).json({ 
      message: 'Los campos team1_sets1_won, team2_sets1_won, team1_sets2_won y team2_sets2_won son obligatorios y deben ser números' 
    });
  }

  // Validar que los sets sean números positivos
  if (team1_sets1_won < 0 || team2_sets1_won < 0 || team1_sets2_won < 0 || team2_sets2_won < 0) {
    return res.status(400).json({ message: 'Los sets deben ser números positivos' });
  }

  // Establecer valores por defecto para los ties si no vienen
  const ties = {
    team1_tie1_won: team1_tie1_won ?? 0,
    team2_tie1_won: team2_tie1_won ?? 0,
    team1_tie2_won: team1_tie2_won ?? 0,
    team2_tie2_won: team2_tie2_won ?? 0,
    team1_tie3_won: team1_tie3_won ?? 0,
    team2_tie3_won: team2_tie3_won ?? 0
  };

  // Validar que los ties sean números positivos si vienen
  for (const [key, value] of Object.entries(ties)) {
    if (typeof value !== 'number' || value < 0) {
      return res.status(400).json({ message: `El campo ${key} debe ser un número positivo` });
    }
  }

  const { data: match, error: matchError } = await supabase
    .from('league_matches')
    .select('*')
    .eq('id', match_id)
    .single();

  if (matchError || !match) {
    return res.status(404).json({ message: 'Partido no encontrado' });
  }

  console.log(match);
  
  // Validar que los equipos sean diferentes
  if (match.league_team1_id === match.league_team2_id) {
    return res.status(400).json({ message: 'Los equipos no pueden ser iguales' });
  }

  // Obtener los team_ids a partir de los league_team_ids
  const { data: leagueTeam1, error: leagueTeam1Error } = await supabase
    .from('league_teams')
    .select('team_id')
    .eq('id', match.league_team1_id)
    .single();

  const { data: leagueTeam2, error: leagueTeam2Error } = await supabase
    .from('league_teams')
    .select('team_id')
    .eq('id', match.league_team2_id)
    .single();

  if (leagueTeam1Error || leagueTeam2Error) {
    return res.status(500).json({ message: 'Error al obtener los equipos de la liga' });
  }

  // Calcular el ganador basado en los sets
  let winnerLeagueTeamId = null;
  const team1TotalSets = team1_sets1_won + team1_sets2_won;
  const team2TotalSets = team2_sets1_won + team2_sets2_won;

  if (team1TotalSets > team2TotalSets) {
    winnerLeagueTeamId = match.league_team1_id;
  } else if (team2TotalSets > team1TotalSets) {
    winnerLeagueTeamId = match.league_team2_id;
  } else { // Si los sets son iguales, decide por tie3
    if (ties.team1_tie3_won > ties.team2_tie3_won) {
      winnerLeagueTeamId = match.league_team1_id;
    } else if (ties.team2_tie3_won > ties.team1_tie3_won) {
      winnerLeagueTeamId = match.league_team2_id;
    }
    // Si tie3 también es igual, winnerLeagueTeamId permanece null
  }

  const { error: updateMatchError } = await supabase
    .from('league_matches')
    .update({
      team1_sets1_won,
      team2_sets1_won,
      team1_sets2_won,
      team2_sets2_won,
      ...ties,
      winner_league_team_id: winnerLeagueTeamId,
      status: 'COMPLETED'
    })
    .eq('id', match_id);

  if (updateMatchError) {
    return res.status(500).json({ message: updateMatchError.message });
  }

  // Actualizar los standings usando los team_ids correctos
  const homeTeamStanding = await supabase
    .from('league_standings')
    .select('*')
    .eq('league_id', match.league_id)
    .eq('team_id', leagueTeam1.team_id)
    .single();

  const awayTeamStanding = await supabase
    .from('league_standings')
    .select('*')
    .eq('league_id', match.league_id)
    .eq('team_id', leagueTeam2.team_id)
    .single();

  console.log('Home Team Standing:', homeTeamStanding);
  console.log('Away Team Standing:', awayTeamStanding);
  
  if (homeTeamStanding.error || awayTeamStanding.error) {
    return res.status(500).json({ message: 'Error al obtener standings' });
  }

  const currentHomeStanding = homeTeamStanding.data;
  const currentAwayStanding = awayTeamStanding.data;

  const homeTeamUpdate = {
    games_played: currentHomeStanding.games_played + 1,
    sets_won: currentHomeStanding.sets_won + team1TotalSets,
    sets_lost: currentHomeStanding.sets_lost + team2TotalSets,
    sets_difference: currentHomeStanding.sets_difference + (team1TotalSets - team2TotalSets)
  };

  if (team1TotalSets > team2TotalSets) {
    homeTeamUpdate.wins = currentHomeStanding.wins + 1;
    homeTeamUpdate.points = currentHomeStanding.points + 2;
    homeTeamUpdate.games_won = currentHomeStanding.games_won + 1;
  } else if (team2TotalSets > team1TotalSets) { // team2 gana en sets
    homeTeamUpdate.losses = currentHomeStanding.losses + 1;
    homeTeamUpdate.games_lost = currentHomeStanding.games_lost + 1;
  } else { // sets iguales, se decide por tie3
    if (ties.team1_tie3_won > ties.team2_tie3_won) {
      homeTeamUpdate.wins = currentHomeStanding.wins + 1;
      homeTeamUpdate.points = currentHomeStanding.points + 2;
      homeTeamUpdate.games_won = currentHomeStanding.games_won + 1;
    } else {
      homeTeamUpdate.losses = currentHomeStanding.losses + 1;
      homeTeamUpdate.games_lost = currentHomeStanding.games_lost + 1;
    }
  }

  const awayTeamUpdate = {
    games_played: currentAwayStanding.games_played + 1,
    sets_won: currentAwayStanding.sets_won + team2TotalSets,
    sets_lost: currentAwayStanding.sets_lost + team1TotalSets,
    sets_difference: currentAwayStanding.sets_difference + (team2TotalSets - team1TotalSets)
  };

  if (team2TotalSets > team1TotalSets) {
    awayTeamUpdate.wins = currentAwayStanding.wins + 1;
    awayTeamUpdate.points = currentAwayStanding.points + 2;
    awayTeamUpdate.games_won = currentAwayStanding.games_won + 1;
  } else if (team1TotalSets > team2TotalSets) { // team1 gana en sets
    awayTeamUpdate.losses = currentAwayStanding.losses + 1;
    awayTeamUpdate.games_lost = currentAwayStanding.games_lost + 1;
  } else { // sets iguales, se decide por tie3
    if (ties.team2_tie3_won > ties.team1_tie3_won) {
      awayTeamUpdate.wins = currentAwayStanding.wins + 1;
      awayTeamUpdate.points = currentAwayStanding.points + 2;
      awayTeamUpdate.games_won = currentAwayStanding.games_won + 1;
    } else {
      awayTeamUpdate.losses = currentAwayStanding.losses + 1;
      awayTeamUpdate.games_lost = currentAwayStanding.games_lost + 1;
    }
  }

  const { error: homeUpdateError } = await supabase
    .from('league_standings')
    .update(homeTeamUpdate)
    .eq('id', currentHomeStanding.id);

  const { error: awayUpdateError } = await supabase
    .from('league_standings')
    .update(awayTeamUpdate)
    .eq('id', currentAwayStanding.id);

    console.log(homeUpdateError);
    console.log(awayUpdateError);
    
  if (homeUpdateError || awayUpdateError) {
    return res.status(500).json({ message: 'Error al actualizar standings' });
  }

  res.status(200).json({
    message: 'Resultado del partido actualizado exitosamente',
    match: { 
      ...match, 
      team1_sets1_won,
      team2_sets1_won,
      team1_sets2_won,
      team2_sets2_won,
      ...ties,
      winner_league_team_id: winnerLeagueTeamId, 
      status: 'COMPLETED'
    }
  });
}

export async function updateMatchSchedule(req, res) {
  const match_id = req.params.id;
  const { date, time, status, court_id } = req.body;

  const { data: match, error: matchError } = await supabase
    .from('league_matches')
    .select('*')
    .eq('id', match_id)
    .single();

  if (matchError || !match) {
    return res.status(404).json({ message: 'Partido no encontrado' });
  }

  if (match.status === 'completed') {
    return res.status(400).json({ message: 'No se puede modificar un partido con resultado registrado' });
  }

  if (date && !isValidDate(date)) {
    return res.status(400).json({ message: 'Fecha inválida' });
  }

  if (time && !isValidTime(time)) {
    return res.status(400).json({ message: 'Hora inválida' });
  }

  if (court_id && date && time) {
    const { data: conflicts, error: conflictError } = await supabase
      .from('league_matches')
      .select('id')
      .eq('court_id', court_id)
      .eq('date', date)
      .eq('time', time)
      .neq('id', match_id);

    if (conflictError) {
      return res.status(500).json({ message: conflictError.message });
    }

    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'Conflicto de horario: ya existe un partido programado en la misma cancha, fecha y hora' });
    }
  }

  const { error: updateError } = await supabase
    .from('league_matches')
    .update({
      date: date || match.date,
      time: time || match.time,
      status: status || match.status,
      court_id: court_id || match.court_id
    })
    .eq('id', match_id);

  if (updateError) {
    return res.status(500).json({ message: updateError.message });
  }

  res.status(200).json({
    message: 'Horario del partido actualizado exitosamente',
    match: { ...match, date, time, status, court_id }
  });
}

function isValidDate(date) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date);
}

function isValidTime(time) {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(time);
}

export async function getMatchesByUserId(req, res) {
  const user_id = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    // 1. Obtener los equipos del usuario
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('id')
      .or(`player1_id.eq.${user_id},player2_id.eq.${user_id}`);

    if (teamsError) {
      return res.status(500).json({ message: teamsError.message });
    }

    if (!teams.length) {
      return res.status(200).json({ 
        matches: [], 
        page, 
        pageSize, 
        total: 0 
      });
    }

    // 2. Obtener los league_teams asociados a estos equipos
    const teamIds = teams.map(team => team.id);
    const { data: leagueTeams, error: leagueTeamsError } = await supabase
      .from('league_teams')
      .select('id')
      .in('team_id', teamIds);

    if (leagueTeamsError) {
      return res.status(500).json({ message: leagueTeamsError.message });
    }

    if (!leagueTeams.length) {
      return res.status(200).json({ 
        matches: [], 
        page, 
        pageSize, 
        total: 0 
      });
    }

    // 3. Obtener los partidos donde el usuario participa
    const leagueTeamIds = leagueTeams.map(lt => lt.id);
    const { data: matches, error: matchesError, count } = await supabase
      .from('league_matches')
      .select(`
        *,
        league:league_id (
          id,
          name,
          status
        ),
        team1:league_team1_id (
          team:team_id (
            player1:player1_id (
              id,
              first_name,
              last_name
            ),
            player2:player2_id (
              id,
              first_name,
              last_name
            )
          )
        ),
        team2:league_team2_id (
          team:team_id (
            player1:player1_id (
              id,
              first_name,
              last_name
            ),
            player2:player2_id (
              id,
              first_name,
              last_name
            )
          )
        )
      `)
      .or(`league_team1_id.in.(${leagueTeamIds.join(',')}),league_team2_id.in.(${leagueTeamIds.join(',')})`)
      .order('match_date', { ascending: false })
      .range(from, to);

    if (matchesError) {
      return res.status(500).json({ message: matchesError.message });
    }

    res.status(200).json({
      matches,
      page,
      pageSize,
      total: count
    });

  } catch (error) {
    console.error('Error getting user matches:', error);
    res.status(500).json({ message: 'Error al obtener los partidos del usuario' });
  }
}

// Funciones auxiliares para el manejo de fechas y horas
function getNextDayOccurrence(currentDateStr, targetDayName, findNext = false) {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const targetDayIndex = dayNames.indexOf(targetDayName.toLowerCase());
  if (targetDayIndex === -1) {
    throw new Error('Invalid play_day name');
  }
  
  const date = new Date(currentDateStr);
  
  if (findNext) {
    // Solo añadir 7 días para la ocurrencia de la próxima semana del mismo día
    date.setDate(date.getDate() + 7);
  } else {
    // Encontrar la primera ocurrencia de targetDayIndex desde startDateStr (inclusive)
    while (date.getDay() !== targetDayIndex) {
      date.setDate(date.getDate() + 1);
    }
  }
  return date.toISOString().split('T')[0]; // Formatear a YYYY-MM-DD
}

function addHoursToTime(timeStr, hoursToAdd) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0); // Establecer la hora y limpiar los componentes de la fecha
  date.setHours(date.getHours() + hoursToAdd);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export async function getMatchesByRound(req, res) {
  const { leagueId } = req.params;
  const round = parseInt(req.query.round) || 1;

  const { data: matches, error } = await supabase
    .from('league_matches')
    .select(`
      *,
      team1:league_team1_id (
        team:team_id (
          player1:player1_id (
            id,
            first_name,
            last_name
          ),
          player2:player2_id (
            id,
            first_name,
            last_name
          )
        )
      ),
      team2:league_team2_id (
        team:team_id (
          player1:player1_id (
            id,
            first_name,
            last_name
          ),
          player2:player2_id (
            id,
            first_name,
            last_name
          )
        )
      )
    `)
    .eq('league_id', leagueId)
    .eq('match_number', round)
    .order('match_date', { ascending: true });

  if (error) {
    console.error('Error getting matches:', error);
    return res.status(500).json({ message: error.message });
  }

  // Formatear los nombres de los equipos
  const formattedMatches = matches.map(match => ({
    ...match,
    team1: `${match.team1.team.player1.first_name} ${match.team1.team.player1.last_name} - ${match.team1.team.player2.first_name} ${match.team1.team.player2.last_name}`,
    team2: `${match.team2.team.player1.first_name} ${match.team2.team.player1.last_name} - ${match.team2.team.player2.first_name} ${match.team2.team.player2.last_name}`
  }));

  res.status(200).json({
    matches: formattedMatches
  });
}

export async function getMatchesByLeague(req, res) {
  const { leagueId } = req.params;

  try {
    console.log('Getting matches for league:', leagueId);

    let query = supabase
      .from('league_matches')
      .select(`
        *,
        category:category_id (
          id,
          name,
          play_day,
          play_time
        ),
        team1:league_team1_id (
          team:team_id (
            player1:player1_id (
              id,
              first_name,
              last_name
            ),
            player2:player2_id (
              id,
              first_name,
              last_name
            )
          )
        ),
        team2:league_team2_id (
          team:team_id (
            player1:player1_id (
              id,
              first_name,
              last_name
            ),
            player2:player2_id (
              id,
              first_name,
              last_name
            )
          )
        )
      `);

    if (leagueId && leagueId !== 'all') {
      query = query.eq('league_id', leagueId);
    }

    query = query.order('match_date', { ascending: true });

    const { data: matches, error } = await query;

    if (error) {
      console.error('Error fetching matches:', error);
      return res.status(500).json({ message: error.message });
    }

    if (!matches) {
      return res.status(200).json({
        completed: [],
        pending: [],
        total: 0
      });
    }

    // Formatear los nombres de los equipos con manejo seguro de nulos
    const formattedMatches = matches.map(match => {
      const formatTeamName = (teamData) => {
        if (!teamData?.team?.player1 || !teamData?.team?.player2) {
          return 'Equipo no disponible';
        }
        const { player1, player2 } = teamData.team;
        return `${player1.first_name || ''} ${player1.last_name || ''} - ${player2.first_name || ''} ${player2.last_name || ''}`.trim();
      };

      return {
        ...match,
        category_name: match.category?.name || 'Categoría no disponible',
        team1: formatTeamName(match.team1),
        team2: formatTeamName(match.team2)
      };
    });

    // Separar los partidos por estado
    const completedMatches = formattedMatches.filter(match => match.status === 'COMPLETED');
    const pendingMatches = formattedMatches.filter(match => match.status === 'SCHEDULED');

    console.log('Completed matches:', completedMatches?.length);
    console.log('Pending matches:', pendingMatches?.length);

    return res.status(200).json({
      completed: completedMatches,
      pending: pendingMatches,
      total: formattedMatches.length
    });

  } catch (error) {
    console.error('Error processing matches:', error);
    return res.status(500).json({ 
      message: 'Error al procesar los partidos de la liga',
      error: error.message 
    });
  }
}