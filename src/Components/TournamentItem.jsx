import { useEffect, useState } from "react";
import { getGameDetails } from "../Services/RAWGService";

function TournamentItem({ tournament }) {
  const [game, setGame] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const data = await getGameDetails(tournament.gameId);
        setGame(data);
      } catch (err) {
        console.error("Error fetching game:", err);
      }
    };

    fetchGame();
  }, [tournament.gameId]);

  return (
    <li className="tournament-item">
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

export default TournamentItem;