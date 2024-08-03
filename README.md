# Cricket Match Details API with Express.js and SQLite

## Project Overview

This project is an Express.js application that provides a RESTful API to perform CRUD operations on a cricket match database. The database consists of three tables: `player_details`, `match_details`, and `player_match_score`. The API allows users to retrieve player information, match details, and player scores, as well as update player details.

## Database Structure

The database `cricketMatchDetails.db` includes the following tables:

### `player_details`
| Column     | Type    |
|------------|---------|
| player_id  | INTEGER |
| player_name| TEXT    |

### `match_details`
| Column   | Type    |
|----------|---------|
| match_id | INTEGER |
| match    | TEXT    |
| year     | INTEGER |

### `player_match_score`
| Column          | Type    |
|-----------------|---------|
| player_match_id | INTEGER |
| player_id       | INTEGER |
| match_id        | INTEGER |
| score           | INTEGER |
| fours           | INTEGER |
| sixes           | INTEGER |

## API Endpoints

### 1. Get All Players
- **Path**: `/players/`
- **Method**: `GET`
- **Description**: Returns a list of all players in the `player_details` table.
- **Response**: JSON array of player objects.

### 2. Get Player by ID
- **Path**: `/players/:playerId/`
- **Method**: `GET`
- **Description**: Returns a specific player based on the player ID.
- **Response**: JSON object with player details.

### 3. Update Player by ID
- **Path**: `/players/:playerId/`
- **Method**: `PUT`
- **Description**: Updates the details of a specific player based on the player ID.
- **Request**: JSON object containing updated player details.
- **Response**: Success message.

### 4. Get Match Details by Match ID
- **Path**: `/matches/:matchId/`
- **Method**: `GET`
- **Description**: Returns the match details of a specific match.
- **Response**: JSON object with match details.

### 5. Get All Matches of a Player
- **Path**: `/players/:playerId/matches`
- **Method**: `GET`
- **Description**: Returns a list of all matches played by a specific player.
- **Response**: JSON array of match objects.

### 6. Get All Players of a Match
- **Path**: `/matches/:matchId/players`
- **Method**: `GET`
- **Description**: Returns a list of players who participated in a specific match.
- **Response**: JSON array of player objects.

### 7. Get Player Scores
- **Path**: `/players/:playerId/playerScores`
- **Method**: `GET`
- **Description**: Returns the total score, number of fours, and sixes hit by a specific player.
- **Response**: JSON object with player statistics.
