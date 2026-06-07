import { useEffect, useState } from 'react';

import './Home.css';
import '../index.css';

import {
  getTournaments,
  createTournament,
} from '../Services/TournamentService';

import { searchGames } from '../Services/RAWGService';

import TournamentItem from '../Components/TournamentItem.jsx';

import { validateTournament } from '../Validators/tournamentValidator';

function Home() {
  const [tournaments, setTournaments] = useState([]);

  const [tournamentName, setTournamentName] = useState('');
  const [tournamentRules, setTournamentRules] = useState('');
  const [gameId, setGameId] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');

  const [gameSearch, setGameSearch] = useState('');
  const [gameResults, setGameResults] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    async function loadTournaments() {
      try {
        const data = await getTournaments();
        setTournaments(data);
      } catch (error) {
        console.error('Error loading tournaments:', error);
      }
    }

    loadTournaments();
  }, []);

  const handleGameSearch = async (query) => {
    setGameSearch(query);

    try {
      const results = await searchGames(query);
      setGameResults(results);
    } catch (error) {
      console.error('RAWG error:', error);
    }
  };

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setGameId(game.id);
    setGameSearch(game.name);
    setGameResults([]);
  };

  const handleCreateTournament = async () => {
    const tournamentData = {
      gameId: Number(gameId),
      name: tournamentName,
      maxParticipants: Number(maxParticipants),
      rules: tournamentRules,
    };

    const validationError = validateTournament(tournamentData);

    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const createdTournament = await createTournament(
        tournamentData
      );

      setTournaments((prev) => [
        ...prev,
        createdTournament,
      ]);

      setTournamentName('');
      setTournamentRules('');
      setGameId('');
      setMaxParticipants('');
      setGameSearch('');
      setSelectedGame(null);

    } catch (error) {
      console.error('Error creating tournament:', error);
      alert(error.message);
    }
  };
  return (
  <div className="home-container">
    <h1>Tournaments</h1>

    <div className="create-tournament-container">
      <h2>Create A Tournament</h2>

      <input
        type="text"
        placeholder="Tournament Name"
        value={tournamentName}
        onChange={(e) => setTournamentName(e.target.value)}
      />

      <textarea
        placeholder="Tournament Rules"
        value={tournamentRules}
        onChange={(e) => setTournamentRules(e.target.value)}
      />

      <input
        type="number"
        placeholder="Max Participants"
        value={maxParticipants}
        onChange={(e) => setMaxParticipants(e.target.value)}
      />

      <div className="game-search-container">
        <input
          type="text"
          placeholder="Search Game"
          value={gameSearch}
          onChange={(e) => handleGameSearch(e.target.value)}
        />

        {gameResults.length > 0 && (
          <ul className="game-results">
            {gameResults.map((game) => (
              <li key={game.id} className="game-result-item">
                <button
                  type="button"
                  onClick={() => handleSelectGame(game)}
                  className="game-result-button"
                >
                  {game.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedGame && (
        <div className="selected-game">
          <p>
            Selected Game: <strong>{selectedGame.name}</strong>
          </p>
        </div>
      )}

      <button onClick={handleCreateTournament}>
        Create Tournament
      </button>
    </div>

    <div className="tournament-list">
  <h2>Existing Tournaments</h2>

  {tournaments.length === 0 ? (
      <p>No tournaments found.</p>
    ) : (
      <ul>
        {tournaments.map((tournament) => (
          <TournamentItem
            key={tournament.id}
            tournament={tournament}
          />
        ))}
      </ul>
    )}
  </div>
</div>
  );
}
export default Home;