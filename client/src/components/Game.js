import { useEffect, useState } from "react";

function Game({ FETCHDOWN, FETCHUP, FETCHDELETE, user, worldmaps }) {
  const [playerInput, setPlayerInput] = useState("");
  const [coords, setCoords] = useState(...user.gamesaves)
  const [currentLocation, setCurrentLocation] = useState({})

  const [prompts, setPrompts] = useState([])

  useEffect(() => {
    // * New gamesaves stay pristine until player saves. Old gamesaves get loaded.
    return user.gamesaves[0].x === null ? (newGame(), console.log("Starting new game...")) : (loadGame(), console.log("Loading game..."))    
  }, [worldmaps])

  const findMap = (x, y) => {
    return !!worldmaps.length && worldmaps.find(map => map.x === x && map.y === y)
  }

  const newGame = () => {
    setCoords({...coords, x:0, y:0})
    setCurrentLocation(findMap(0,0))
    setPrompts([...prompts, findMap(0,0).name, findMap(0,0).description])
  }

  const loadGame = () => {
    setCurrentLocation(findMap(coords.x, coords.y))
    setPrompts([...prompts, findMap(coords.x, coords.y).name, findMap(coords.x, coords.y).description])
  }

  // ! Deprecated -- Does not work with dynamic newGame init
  // const checkLocation = () => {
  //   const {x, y} = coords;
  //   console.log("GAME/X: ",x);
  //   console.log("GAME/Y: ",y);
  //   console.log("GAME/MAPS: ",worldmaps);
  //   console.log("GAME/CURRENT: ",worldmaps.find(map => map.x === x && map.y === y))
  // }

  const forceKeepFocus = (e) => {
    e.target.focus()
  }
  
  const handleInputChange = (e) => {
    setPlayerInput(e.target.value);
  }

  const handleInputSubmit = (e) => {
    if (e.key === "Enter") {
      const splitInput = playerInput.toLowerCase().split(" ")
      const filterDirection = splitInput.filter(input => input === "north" || input === "east" || input === "south" || input === "west")
      !!filterDirection.length ? cmdMove(filterDirection[0]) : /*await errPrompt()*/ console.log("You can't do that");
      setPlayerInput("");
    }
  }
  
  const handleUpdateCoords = (direction) => {
    direction.includes("north") && currentLocation.north ? setCoords({...coords, y: coords.y += 1}) :
    direction.includes("east") && currentLocation.east ? setCoords({...coords, x: coords.x += 1}) :
    direction.includes("south") && currentLocation.south ? setCoords({...coords, y: coords.y -= 1}) :
    direction.includes("west") && currentLocation.west && setCoords({...coords, x: coords.x -= 1});
  }
  
  const handleUpdateLocation = (direction) => {
    const newLocation = worldmaps.find(map => map.x === coords.x && map.y === coords.y);
    setCurrentLocation(newLocation);
    return currentLocation[direction] ? setPrompts([...prompts, "> "+playerInput, newLocation.name, newLocation.description]) : errPrompt();

    // ? Code deprecated-ish. *WANT* each of these to push into state and render as program loads to create a more interactive feel.
    // addPrompt(playerInput);
    // addPrompt(newLocation.name);
    // addPrompt(newLocation.description);
  }

  const cmdMove = (direction) => {
    // console.log(`Before MOVE: ${coords.x}, ${coords.y}`);
    handleUpdateCoords(direction);
    // console.log(`After MOVE: ${coords.x}, ${coords.y}`);
    handleUpdateLocation(direction);
  }

  // const addPrompt = async (prompt) => {
  //   if (prompt === playerInput) {
  //     setPrompts([...prompts, "> "+prompt])
  //   } else {
  //     setPrompts([...prompts, prompt])
  //   }
  // }

  const errPrompt = () => {
    setPrompts([...prompts, "> "+playerInput, "You can't do that..."])
  }

  return (
    <div className="Game">
      <div className="game-prompts">
        <div className="">
          To move in a direction, type a cardinal direction into the terminal and press enter. For example, "Go North."<br />
        </div>        
        {/* <div> */}
          {/* // TODO psuedo concept code */}
          {/* game.room<br /> */}
          {/* game.description<br /> */}
          {/* game.prompt ? prompt a : prompt b */}
          {/* game.directions<br /> */}
          {/* &gt; player.input<br /> */}
          {/* game.response<br /> */}
        {/* </div> */}
        {prompts.map((prompt, i) => <span key={"prompt"+i}>{prompt}</span>)}
        {/* {prompts.map((prompt, i) => <div key={"prompt"+i}>{prompt}</div>)} */}
      <div className="game-input">
        <div className="game-input-spacer">
          &gt;&nbsp; 
        </div>
        <div className="game-input">
          <input id="game-input" type="text" onChange={handleInputChange} onKeyDown={handleInputSubmit} value={playerInput} autoComplete="off" onBlur={forceKeepFocus} autoFocus />
        </div>
        <div className="game-input-spacer">
          &nbsp;&nbsp;
        </div>
      </div>
      </div>
    </div>
  );
}

export default Game;