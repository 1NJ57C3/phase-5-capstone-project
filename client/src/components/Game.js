function Game() {
  return (
    <div className="Game">
      <div className="game-prompts">
        {/* // TODO psuedo concept code */}
        game.room<br />
        game.description<br />
        game.prompt ? prompt a : prompt b
        game.directions<br />
        &gt; player.input<br />
        game.response<br />
      </div>
      <div className="game-input">
        <div className="game-input-spacer">
          <label htmlFor="game-input">
            &nbsp;&gt;&nbsp; 
          </label>
        </div>
        <div className="game-input">
          <input type="text" placeholder="Player Action/Blinking block cursor goes here" id="game-input" autoComplete="off" autoFocus />
        </div>
        <div className="game-input-spacer">
          &nbsp;&nbsp;&nbsp;
        </div>
      </div>
    </div>
  );
}

export default Game;