import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [tournaments, setTournaments] = useState([])

  useEffect(() => {
    fetch("http://localhost:8080/api/tournaments")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched tournaments:", data)
        setTournaments(data)
      })
      .catch((error) => console.error("Error fetching tournaments:", error))
  }, [])

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

        <button onClick={sendTestTournament}>Send Test Tournament</button>

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

const sendTestTournament = async () => {
console.log("Button clicked");

  try {
    const response = await fetch("http://localhost:8080/api/tournaments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gameId: 218,
        name: "clash royale tournament",
        maxParticipants: 64,
        rules: "Do not use mega knight"
      })
    });

    const data = await response.json();
    console.log("Created tournament:", data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export default App
