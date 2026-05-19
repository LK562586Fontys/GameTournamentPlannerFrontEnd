import { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import './Home.css'
import '../index.css'

function Home() {
  const [tournaments, setTournaments] = useState([])

  const [tournamentName, setTournamentName] = useState('')
  const [tournamentRules, setTournamentRules] = useState('')
  const [gameId, setGameId] = useState('')
  const [maxParticipants, setMaxParticipants] = useState('')
  const [gameSearch, setGameSearch] = useState('')
  const [gameResults, setGameResults] = useState([])
  const [selectedGame, setSelectedGame] = useState(null)
  const searchGames = async (query) => {
  if (!query) return;

  try {
    const res = await fetch(
      `https://api.rawg.io/api/games?key=2e4d67e3eaea4cab87c6b089721bb288&search=${query}`
    );
    const data = await res.json();
    setGameResults(data.results);
  } catch (err) {
    console.error("RAWG error:", err);
  }
  };

  useEffect(() => {
    fetch("http://localhost:8081/api/tournaments")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched tournaments:", data)
        setTournaments(data)
      })
      .catch((error) => console.error("Error fetching tournaments:", error))
  }, [])

  const sendTestTournament = async () => {
    console.log("Button clicked");

    if (!tournamentName || !tournamentRules || !selectedGame || !maxParticipants) {
      alert("Please fill in all fields before creating a tournament.");
      return;
    }

    if (Number.isNaN(Number(gameId)) || Number.isNaN(Number(maxParticipants))) {
      alert("Game ID and Max Participants must be valid numbers.");
      return;
    }

    if (Number(maxParticipants) <= 0 || Math.log2(Number(maxParticipants)) % 1 !== 0) {
      alert("Max participants must be a positive power of 2.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/tournaments", {
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

      <h1>game tournament planner</h1>

      <div className="card">

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
          type="text"
          placeholder="Search game..."
          value={gameSearch}
          onChange={(e) => {
            const value = e.target.value;
            setGameSearch(value);
            searchGames(value);
          }}
        />

        <ul>
          {gameResults.map((game) => (
           <li key={game.id}>
             <button
               onClick={() => {
                 setSelectedGame(game);
                  setGameId(game.id);
                 setGameSearch(game.name);
                  setGameResults([]);
                 }}
                style={{ cursor: "pointer" }}
             >
                {game.name}
             </button>
            </li>
          ))}
        </ul>  
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
      </div>

      <h2>Tournaments</h2>
        {tournaments.map((tournament, index) => (
          <TournamentItem
            key={tournament.id ?? index}
            tournament={tournament}
          />
        ))}
    </>
  )
}

function TournamentItem({ tournament }) {
  const [game, setGame] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games/${tournament.gameId}?key=2e4d67e3eaea4cab87c6b089721bb288`
        );
        const data = await res.json();
        setGame(data);
      } catch (err) {
        console.error("Error fetching game:", err);
      }
    };

    fetchGame();
  }, [tournament.gameId]);

  return (
    <li>
      <p>
        Name: {tournament.name} - Rules: {tournament.rules} - Max: {tournament.maxParticipants}
        {" - Game: "}
        {game ? game.name : "Loading..."}
      </p>

      {game?.background_image && (
        <img
          src={game.background_image}
          alt={game.name}
          width="200"
        />
      )}
    </li>
  );
}

TournamentItem.propTypes = {
  tournament: PropTypes.shape({
    gameId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    rules: PropTypes.string.isRequired,
    maxParticipants: PropTypes.number.isRequired,
  }).isRequired,
};

export default Home