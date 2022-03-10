function GameCard({ FETCHDELETE, worldmaps, game, user, setUser, gamesaveIndex }) {

    const handleDeleteGame = () => {
        const fetchAction = () => setUser({...user, gamesaves: user.gamesaves.filter(g => g.id !== game.id)})
        FETCHDELETE(`/gamesaves/${game.id}`, fetchAction)
    }

    const findMap = (x, y) => {
        return !!worldmaps.length && worldmaps.find(map => map.x === x && map.y === y)
    }

    return (
        <div className="game-card">
            <span className="game-card-header">
                No. {gamesaveIndex+1}
            </span>
            <span className="game-card-content">
                Current Location: {game.x !== null ? findMap(game.x, game.y).name : "-"}
            </span>
            <span className="game-card-buttons">
                <button className="game-menu" type="button">Load</button>
                <button className="game-menu" onClick={handleDeleteGame} type="button">Delete</button>
            </span>
        </div>
    )
}

export default GameCard;