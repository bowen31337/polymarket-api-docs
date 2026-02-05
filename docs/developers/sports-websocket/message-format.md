> ## Documentation Index
> Fetch the complete documentation index at: https://docs.polymarket.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Message Format

> Structure of sports result update messages

Once connected to the Sports WebSocket, clients receive JSON messages whenever a sports event updates. Messages are broadcast to all connected clients automatically.

***

## sport\_result Message

Emitted when:

* A match goes live
* The score changes
* The period changes (e.g., halftime, overtime)
* A match ends
* Possession changes (NFL and CFB only)

### Structure

<ParamField path="gameId" type="number">
  Unique identifier for the game
</ParamField>

<ParamField path="leagueAbbreviation" type="string">
  League identifier (e.g., `"nfl"`, `"nba"`, `"cs2"`)
</ParamField>

<ParamField path="homeTeam" type="string">
  Home team name or abbreviation
</ParamField>

<ParamField path="awayTeam" type="string">
  Away team name or abbreviation
</ParamField>

<ParamField path="status" type="string">
  Game status (e.g., `"InProgress"`, `"finished"`)
</ParamField>

<ParamField path="live" type="boolean">
  `true` if the match is currently in progress
</ParamField>

<ParamField path="ended" type="boolean">
  `true` if the match has concluded
</ParamField>

<ParamField path="score" type="string">
  Current score (format varies by sport)
</ParamField>

<ParamField path="period" type="string">
  Current period (e.g., `"Q4"`, `"2H"`, `"2/3"`)
</ParamField>

<ParamField path="elapsed" type="string">
  Time elapsed in current period (e.g., `"05:09"`)
</ParamField>

<ParamField path="finishedTimestamp" type="string">
  Timestamp when the match ended (only present when `ended: true`)
</ParamField>

<ParamField path="turn" type="string">
  Team abbreviation with possession (NFL/CFB only)
</ParamField>

<Note>
  The `turn` field is only present for NFL and CFB games and indicates which team currently has the ball.
</Note>

### Example Messages

**NFL (in progress):**

```json  theme={null}
{
  "gameId": 19439,
  "leagueAbbreviation": "nfl",
  "homeTeam": "LAC",
  "awayTeam": "BUF",
  "status": "InProgress",
  "score": "3-16",
  "period": "Q4",
  "elapsed": "5:18",
  "live": true,
  "ended": false,
  "turn": "lac"
}
```

**Esports - CS2 (finished):**

```json  theme={null}
{
  "gameId": 1317359,
  "leagueAbbreviation": "cs2",
  "homeTeam": "ARCRED",
  "awayTeam": "The glecs",
  "status": "finished",
  "score": "000-000|2-0|Bo3",
  "period": "2/3",
  "live": false,
  "ended": true
}
```

***

## Slug Format

The `slug` field follows a consistent naming convention:

```
{league}-{team1}-{team2}-{date}
```

**Examples:**

* `nfl-buf-kc-2025-01-26` — NFL: Buffalo Bills vs Kansas City Chiefs
* `nba-lal-bos-2025-02-15` — NBA: LA Lakers vs Boston Celtics
* `mlb-nyy-bos-2025-04-01` — MLB: NY Yankees vs Boston Red Sox

***

## Period Values

| Period                 | Description                             |
| ---------------------- | --------------------------------------- |
| `1H`                   | First half                              |
| `2H`                   | Second half                             |
| `1Q`, `2Q`, `3Q`, `4Q` | Quarters (NFL, NBA)                     |
| `HT`                   | Halftime                                |
| `FT`                   | Full time (match ended in regulation)   |
| `FT OT`                | Full time with overtime                 |
| `FT NR`                | Full time, no result (draw or canceled) |
| `End 1`, `End 2`, etc. | End of inning (MLB)                     |
| `1/3`, `2/3`, `3/3`    | Map number in Bo3 series (Esports)      |
| `1/5`, `2/5`, etc.     | Map number in Bo5 series (Esports)      |

***

## Handling Updates

When processing messages, use the `gameId` field as the unique identifier to update your local state:

```javascript  theme={null}
// Update or insert based on gameId
setSportsData(prev => {
  const existing = prev.find(item => item.gameId === data.gameId);
  if (existing) {
    return prev.map(item => 
      item.gameId === data.gameId ? data : item
    );
  }
  return [...prev, data];
});
```
