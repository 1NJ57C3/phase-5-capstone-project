import { useState } from "react";

function Game({ maps, user }) {
  const [playerInput, setPlayerInput] = useState("");
  // let {pos_x, pos_y} = user.gamesaves[0];

  // const currentLocation = () => {
  //   const {pos_x, pos_y} = user.gamesaves[0];
  //   console.log("GAME/X: ",pos_x);
  //   console.log("GAME/Y: ",pos_y);
  //   console.log("GAME/MAPS: ",maps);
  // }
  // currentLocation();

  
  const handleInputChange = (e) => {
    setPlayerInput(e.target.value);
  }
  
  // console.log( playerInput.toLowerCase().includes("north") && move("NORTH") )
  
  // TODO Move from current grid to next grid based on input of N/E/S/W || North/East/South/West
  const [gps, setGPS] = useState({pos_x: 0, pos_y: 0})
  const [loc, setLoc] = useState({})

  // console.log ( !!Object.keys(user.gamesaves[0]).length ? setGPS({...gps}) : "nah" );
  // let {pos_x, pos_y} = user.gamesaves[0];

  const resetLocation = async () => {
    console.log("User Location: x:",user.gamesaves[0].pos_x," y:",user.gamesaves[0].pos_y)
    await loadGPS();
    await updateLocation();
    console.log("Current Location: x: ",gps.pos_x," y:",gps.pos_y)
  }

  const loadGPS = async () => {
    setGPS({...gps, pos_x: user.gamesaves[0].pos_x, pos_y: user.gamesaves[0].pos_y})
  }

  const updateLocation = async () => {
    setLoc(maps.find(map => map.pos_x === gps.pos_x && map.pos_y === gps.pos_y))
  }

  // console.log ("Current Location: ",maps.find(map => map.pos_x === gps.pos_x && map.pos_y === gps.pos_y))
  
  const move = async (direction) => {
    console.log(`Before MOVE: ${gps.pos_x}, ${gps.pos_y}`);
    await direction.toLowerCase().includes("north") && !!loc.north ? setGPS({...gps, pos_y: gps.pos_y += 1}) :
    direction.toLowerCase().includes("east") && !!loc.east ? setGPS({...gps, pos_x: gps.pos_x += 1}) :
    direction.toLowerCase().includes("south") && !!loc.south ? setGPS({...gps, pos_y: gps.pos_y -= 1}) :
    direction.toLowerCase().includes("west") && !!loc.west ? setGPS({...gps, pos_x: gps.pos_x -= 1}) :
    console.log("Can't go that way");
    await updateLocation();
    console.log(`After MOVE: ${gps.pos_x}, ${gps.pos_y}`);
  }

  // TODO Take input string

  // TODO Filter -- input.includes keyword && GAMESAVES[:pos_x || :pos_y] ++ || --

  // TODO 

  return (
    <div className="Game">
      <div className="game-prompts">
        {/* // TODO psuedo concept code -- dispense into cards? */}
        game.room<br />
        game.description<br />
        game.prompt ? prompt a : prompt b
        game.directions<br />
        &gt; player.input<br />
        game.response<br />
      </div>
      <div className="game-input">
        <div className="game-input-spacer" id="game-input-spacer-left">
          <label htmlFor="game-input">
            &nbsp;&gt;&nbsp; 
          </label>
        </div>
        <div className="game-input">
          <input id="game-input" type="text" value={playerInput} onChange={handleInputChange} placeholder="Player Action/Blinking block cursor goes here" autoComplete="off" autoFocus />
          <button onClick={()=>move(playerInput)} className="game-input">»</button>
          <button onClick={resetLocation} className="game-input">⎚</button>
        </div>
        <div className="game-input-spacer"  id="game-input-spacer-right">
          &nbsp;&nbsp;&nbsp;
        </div>
      </div>
    </div>
  );
}

export default Game;