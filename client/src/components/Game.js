import { useEffect, useState } from "react";

function Game({ FETCHDOWN, FETCHUP, FETCHDELETE, user, setUser, worldmaps, setWorldmaps }) {
  const [playerInput, setPlayerInput] = useState("");
  const [coords, setCoords] = useState({})
  const [currentLocation, setCurrentLocation] = useState({})

  const [prompts, setPrompts] = useState([])

  useEffect(() => {
    FETCHDOWN("/worldmaps", setWorldmaps, "skipErr")
  }, [])

  useEffect(() => {
    // * New gamesaves stay pristine until player saves. Old gamesaves get loaded.
    // debugger
    // return !!Object.keys(user.gamesaves).length && user.gamesaves[0].x != null ? (console.log("Game initialized... Existing save detected."), loadGame("init")) : (console.log("Game initialized..."), newGame())
    return !!Object.keys(user.gamesaves).length ? (console.log("Game initialized... Existing save detected."), loadGame("init")) : (console.log("Game initialized..."), newGame())
  }, [worldmaps])

  const findMap = (x, y) => {
    return !!worldmaps.length && worldmaps.find(map => map.x === x && map.y === y)
  }

  const newGame = () => {
    console.log('NEW GAME INITIALIZED')
    setCoords({...coords, x:0, y:0})
    setCurrentLocation(findMap(0,0))
    setPrompts([findMap(0,0).description, findMap(0,0).name])
  }

  const loadGame = (init=false) => {
    console.log('LOAD GAME INITIALIZED')
    return user.gamesaves[0].x != null ? (
      console.log('Coordinates validation complete.'),
      setCoords({...user.gamesaves[0]}),
      setCurrentLocation(findMap(user.gamesaves[0].x, user.gamesaves[0].y)),
      !!init && setPrompts([findMap(user.gamesaves[0].x, user.gamesaves[0].y).description, findMap(user.gamesaves[0].x, user.gamesaves[0].y).name])
    ) : (
      console.log('Coordinates validation failed... Compensating...'),
      setCoords({...user.gamesaves[0], x: 0, y: 0}),
      setCurrentLocation(findMap(0,0)),
      !!init && setPrompts([findMap(0,0).description, findMap(0,0).name])
    ),
    console.log("GAME LOADED: ", user.gamesaves[0])
  }

  const saveGame = () => {
    return !!coords.id ?
      FETCHUP(`/gamesaves/${coords.id}`, "PATCH", coords, game => {
        console.log("SAVED (UPDATED) GAME AT: ", game)
        setUser({...user, gamesaves: user.gamesaves.map(g => g.id === game.id ? game : g)})
      }) :
      FETCHUP(`/gamesaves/`, "POST", coords, game => {
        console.log("SAVED NEW GAME: ", game)
        setUser({...user, gamesaves: [game]})
        setCoords({...coords, id: game.id})
      })
    // console.log("COORDS AT SAVE: ",coords)
    // console.log("GAMESAVES AT SAVE: ",user.gamesaves[0])
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

      const filterHelp = splitInput.filter(input => input === ".help")
      !!filterHelp.length && cmdHelp();

      const filterSave = splitInput.filter(input => input === ".save")
      !!filterSave.length && cmdSave();

      const filterLoad = splitInput.filter(input => input === ".load")
      !!filterLoad.length && cmdLoad();

      const filterDirection = splitInput.filter(input => input === "north" || input === "east" || input === "south" || input === "west")
      !!filterDirection.length && cmdMove(filterDirection[0])

      // * ERROR HANDLING

      !/^north$|^east$|^south$|^west$|^.help$|^.save$|^.load$/.test(splitInput) && errPrompt();
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
    // setPrompts([findMap(coords.x, coords.y).description, findMap(coords.x, coords.y).name, <br />,"> "+playerInput, ...prompts])
    // debugger
    // setCurrentLocation(findMap(user.gamesaves[0].x, user.gamesaves[0].y))
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