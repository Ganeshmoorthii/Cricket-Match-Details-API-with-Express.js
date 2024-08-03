const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'cricketMatchDetails.db')
let db = null

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

const convertDbObjToPlayerObj = dbObj => {
  return {
    playerId: dbObj.player_id,
    playerName: dbObj.player_name,
  }
}

const convertDbObjToMatchObj = dbObj => {
  return {
    matchId: dbObj.match_id,
    match: dbObj.match,
    year: dbObj.year,
  }
}

// API 1: Get all players
app.get('/players/', async (req, res) => {
  const getPlayersQuery = `SELECT * FROM player_details;`
  const playersArray = await db.all(getPlayersQuery)
  res.send(playersArray.map(player => convertDbObjToPlayerObj(player)))
})

// API 2: Get player by ID
app.get('/players/:playerId/', async (req, res) => {
  const {playerId} = req.params
  const getPlayerQuery = `SELECT * FROM player_details WHERE player_id = ${playerId};`
  const player = await db.get(getPlayerQuery)
  res.send(convertDbObjToPlayerObj(player))
})

// API 3: Update player details by ID
app.put('/players/:playerId/', async (req, res) => {
  const {playerId} = req.params
  const {playerName} = req.body
  const updatePlayerQuery = `
    UPDATE player_details
    SET player_name = "${playerName}"
    WHERE player_id = ${playerId};
  `
  await db.run(updatePlayerQuery)
  res.send('Player Details Updated')
})

// API 4: Get match details by ID
app.get('/matches/:matchId/', async (req, res) => {
  const {matchId} = req.params
  const getMatchQuery = `SELECT * FROM match_details WHERE match_id = ${matchId};`
  const match = await db.get(getMatchQuery)
  res.send(convertDbObjToMatchObj(match))
})

// API 5: Get all matches of a player
app.get('/players/:playerId/matches', async (req, res) => {
  const {playerId} = req.params
  const getMatchesQuery = `
    SELECT match_details.match_id, match, year
    FROM player_match_score
    NATURAL JOIN match_details
    WHERE player_match_score.player_id = ${playerId};
  `
  const matchesArray = await db.all(getMatchesQuery)
  res.send(matchesArray.map(match => convertDbObjToMatchObj(match)))
})

// API 6: Get all players of a specific match
app.get('/matches/:matchId/players', async (req, res) => {
  const {matchId} = req.params
  const getPlayersQuery = `
    SELECT player_details.player_id, player_name
    FROM player_match_score
    NATURAL JOIN player_details
    WHERE match_id = ${matchId};
  `
  const playersArray = await db.all(getPlayersQuery)
  res.send(playersArray.map(player => convertDbObjToPlayerObj(player)))
})

// API 7: Get player statistics by ID
app.get('/players/:playerId/playerScores', async (req, res) => {
  const {playerId} = req.params
  const getPlayerStatsQuery = `
    SELECT 
      player_details.player_id,
      player_details.player_name,
      SUM(player_match_score.score) AS totalScore,
      SUM(player_match_score.fours) AS totalFours,
      SUM(player_match_score.sixes) AS totalSixes
    FROM 
      player_match_score
    INNER JOIN 
      player_details ON player_match_score.player_id = player_details.player_id
    WHERE 
      player_match_score.player_id = ${playerId};
  `
  const playerStats = await db.get(getPlayerStatsQuery)
  const response = {
    playerId: playerStats.player_id,
    playerName: playerStats.player_name,
    totalScore: playerStats.totalScore,
    totalFours: playerStats.totalFours,
    totalSixes: playerStats.totalSixes,
  }
  res.send(response)
})

module.exports = app
