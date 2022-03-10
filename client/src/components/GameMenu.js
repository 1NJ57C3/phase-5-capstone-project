import { useEffect } from "react";
import GameCard from "./GameCard";

function GameMenu({ FETCHDOWN, FETCHUP, FETCHDELETE, user, setUser, worldmaps, setWorldmaps }) {

    useEffect(() => {
        FETCHDOWN("/worldmaps", setWorldmaps, "skipErr")
    }, [])

    const handleCreateGame = () => {
        const fetchAction = (game) => { setUser({...user, gamesaves: [...user.gamesaves, game]}) }
        FETCHUP("/gamesaves", "POST", "", fetchAction)
    }

    return (
        <div className="game-menu">
            <big className="game-menu-header">Hello, {user.username}.</big>
            {!!user.gamesaves.length && user.gamesaves.map((game, gsIndex) => <GameCard key={game.id} FETCHDELETE={FETCHDELETE} worldmaps={worldmaps} game={game} user={user} setUser={setUser} gamesaveIndex={gsIndex} />)}
            <span className="game-menu"><button className="game-menu" onClick={handleCreateGame} type="button">New Game</button></span>
        </div>
    )
}

export default GameMenu;