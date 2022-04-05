import { useEffect, useState } from "react";

function Game({ FETCHDOWN, FETCHUP, FETCHDELETE, user, setUser, worldmaps, setWorldmaps }) {
  const [playerInput, setPlayerInput] = useState("");
  const [coords, setCoords] = useState({}) // * GameID (if applicable) and player's current coordinates
  const [currentLocation, setCurrentLocation] = useState({}) // * worldmap that matches player's current coordinates
  const [prompts, setPrompts] = useState([]) // * Messages displayed in Game terminal

  useEffect(() => {
    FETCHDOWN("/worldmaps", setWorldmaps, "skipErr")
  }, [])

  useEffect(() => {
    // * New gamesaves stay pristine until player saves. Old gamesaves get loaded. Less visual bloat at GameMenu.
    return !!Object.keys(user.gamesaves).length ? (console.log("Game initialized... Existing save detected."), loadGame("init")) : (console.log("Game initialized..."), newGame())
  }, [worldmaps])

  const findMap = (x, y) => {
    // * Find worldmap that matches coordinates (params)
    return !!worldmaps.length && worldmaps.find(map => map.x === x && map.y === y)
  }

  const newGame = () => {
    console.log("INITIALIZING NEW GAME")
    setCoords({...coords, x:0, y:0})
    setCurrentLocation(findMap(0,0))
    setPrompts([findMap(0,0).description, findMap(0,0).name])
    console.log("GAME STARTED")
  }

  const loadGame = (init=false) => {
    console.log("INITIALIZING LOAD GAME SEQUENCE")
    return user.gamesaves[0].x != null ? (
      console.log("Coordinates validation complete."),
      setCoords({...user.gamesaves[0]}),
      setCurrentLocation(findMap(user.gamesaves[0].x, user.gamesaves[0].y)),
      !!init && setPrompts([findMap(user.gamesaves[0].x, user.gamesaves[0].y).description, findMap(user.gamesaves[0].x, user.gamesaves[0].y).name])
    ) : (
      console.log("Coordinates validation failed... Adjusting..."),
      setCoords({...user.gamesaves[0], x: 0, y: 0}),
      setCurrentLocation(findMap(0,0)),
      !!init && setPrompts([findMap(0,0).description, findMap(0,0).name])
    ),
    console.log("GAME LOADED: ", user.gamesaves[0])
  }

  const saveGame = () => {
    // * if Game ID exists in coords state
    return !!coords.id ?
      // * update corresponding save.
      FETCHUP(`/gamesaves/${coords.id}`, "PATCH", coords, game => {
        console.log("SAVED (UPDATED) GAME AT: ", game)
        setUser({...user, gamesaves: user.gamesaves.map(g => g.id === game.id ? game : g)})
      }) :
      // * Otherwise, create new save.
      FETCHUP(`/gamesaves/`, "POST", coords, game => {
        console.log("SAVED NEW GAME: ", game)
        setUser({...user, gamesaves: [game]})
        setCoords({...coords, id: game.id})
      }),
    console.log("OLD COORDS AT SAVE: ",user.gamesaves[0]),
    console.log("NEW COORDS AT SAVE: ",coords);
  }

  const forceKeepFocus = (e) => {
    e.target.focus()
  }

  const handleInputChange = (e) => {
    setPlayerInput(e.target.value);
  }

  const handleInputSubmit = (e) => {
    if (e.key === "Enter") {
      const splitInput = playerInput.toLowerCase().split(" ")

      const filterHelp = splitInput.filter(input => input === ".help")
      !!filterHelp.length && cmdHelp();

      const filterSave = splitInput.filter(input => input === ".save")
      !!filterSave.length && cmdSave();

      const filterLoad = splitInput.filter(input => input === ".load")
      !!filterLoad.length && cmdLoad();

      const filterDirection = splitInput.filter(input => input === "north" || input === "east" || input === "south" || input === "west")
      !!filterDirection.length && cmdMove(filterDirection[0])

      // * ERROR HANDLING
      // TODO Discovered this is *too* strict -- No longer allows looser player commands
      /* !/^north$|^east$|^south$|^west$|^.help$|^.save$|^.load$/.test(splitInput) && errPrompt(); */
      ![...filterHelp, ...filterSave, ...filterLoad, ...filterDirection].length && errPrompt();
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
    return !!currentLocation[direction] ? setPrompts([newLocation.description, newLocation.name, <br />, "> "+playerInput, ...prompts]) : errPrompt();
  }

  const cmdMove = (direction) => {
    handleUpdateCoords(direction);
    handleUpdateLocation(direction);
  }

  const cmdHelp = () => {
    setPrompts([
      <br />,
      ".save : save game",
      ".load : load game",
      ".help : this menu",
      "Commands:",<br />,
      "West",
      "South",
      "East",
      "North",
      "Movement:",<br />,
      "> "+playerInput, ...prompts
    ])
  }

  const cmdSave = () => {
    saveGame()
    setPrompts([<br />, "Game saved.", "> "+playerInput, ...prompts])
  }

  const cmdLoad = () => {
    loadGame()
    setPrompts([findMap(user.gamesaves[0].x, user.gamesaves[0].y).description, findMap(user.gamesaves[0].x, user.gamesaves[0].y).name, <br />, "Game loaded." ,"> "+playerInput, ...prompts])
  }

  // const addPrompt = async (prompt) => {
  //   if (prompt === playerInput) {
  //     setPrompts([...prompts, "> "+prompt])
  //   } else {
  //     setPrompts([...prompts, prompt])
  //   }
  // }

  const errPrompt = () => {
    setPrompts(["You can't do that...", <br />, "> "+playerInput, ...prompts])
  }

  return (
    <div className="Game" onClick={e => console.log(e)}>
      <div className="game-prompts">
        {prompts.map((prompt, i) => <span className="game-prompts" key={"prompt"+i}>{prompt}</span>)}
        <div className="game-help">
          To move in a direction, type a cardinal direction into the terminal and press enter. For example, "Go North" and press the "Enter" key.<br />
          Type ".help" at any time to see a list of commands.<br /><br />
        </div>        
      </div>
      <div className="game-input-wrapper">
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
  );
}

export default Game;