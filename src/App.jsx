import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [tournaments, setTournaments] = useState([])

  const [tournamentName, setTournamentName] = useState('')
  const [tournamentRules, setTournamentRules] = useState('')
  const [gameId, setGameId] = useState('')
  const [maxParticipants, setMaxParticipants] = useState('')

  useEffect(() => {
    fetch("http://localhost:8080/api/tournaments")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched tournaments:", data)
        setTournaments(data)
      })
      .catch((error) => console.error("Error fetching tournaments:", error))
  }, [])

  const sendTestTournament = async () => {
    console.log("Button clicked");

    if (!tournamentName || !tournamentRules || !gameId || !maxParticipants) {
      alert("Please fill in all fields before creating a tournament.");
      return;
    }

    if (isNaN(gameId) || isNaN(maxParticipants)) {
      alert("Game ID and Max Participants must be valid numbers.");
      return;
    }

    if (Number(maxParticipants) <= 0 || Math.log2(Number(maxParticipants)) % 1 !== 0) {
      alert("Max participants must be a positive power of 2.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          gameId: Number(gameId),
          name: tournamentName,
          maxParticipants: Number(maxParticipants),
          rules: tournamentRules
        })
      });

      setTournamentName('')
      setTournamentRules('')
      setGameId('')
      setMaxParticipants('')

      const data = await response.json();
      console.log("Created tournament:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>game tournament planner</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        <h2>Create Tournament</h2>
      <div className="card">
        <input
          type="text"
          placeholder="Tournament name"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
        />

        <br />

        <input
          type="text"
          placeholder="Rules"
          value={tournamentRules}
          onChange={(e) => setTournamentRules(e.target.value)}
        />

        <br />

        <input
          type="number"
          placeholder="Game ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />

        <br />

        <input
          type="number"
          placeholder="Max participants"
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
        />

        <br />

        <button onClick={sendTestTournament}>
          Create Tournament
        </button>
      </div>

        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <h2>Tournaments</h2>

      {tournaments.length > 0 ? (
        <ul>
          {tournaments.map((tournament, index) => (
            <li key={tournament.id ?? index}>
              Name: {tournament.name} - Rules: {tournament.rules} - Maximum Participants: {tournament.maxParticipants}
            </li>
          ))}
        </ul>
      ) : (
      <p>No tournaments found.</p>
      )}

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
