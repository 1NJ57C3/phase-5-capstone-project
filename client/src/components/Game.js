import { useEffect, useState } from "react";

function Game({ FETCHDOWN, FETCHUP, FETCHDELETE, user, setUser, worldmaps, setWorldmaps }) {
  const [playerInput, setPlayerInput] = useState("");
  const [coords, setCoords] = useState({}) // * GameID (if applicable) and player's current coordinates
  const [currentLocation, setCurrentLocation] = useState({}) // * worldmap that matches player's current coordinates
  const [prompts, setPrompts] = useState([]) // * Messages displayed in Game terminal
  // const [inventory, setInventory] = useState([]) // * Inventory

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
    setCoords({...coords, x:0, y:0, user_id: user.id, drops: []})
    setCurrentLocation(findMap(0,0))
    setPrompts([findMap(0,0).description, findMap(0,0).name])
    console.log("GAME STARTED")
  }

  const loadGame = (init=false) => {
    console.log("INITIALIZING LOAD GAME SEQUENCE")
    // return (user.gamesaves[0].x != null ? (
    return (!!user.gamesaves.length && user.gamesaves[0].x != null ? (
      console.log("Coordinates validation complete."),
      setCoords({...user.gamesaves[0]}),
      setCurrentLocation(findMap(user.gamesaves[0].x, user.gamesaves[0].y)),
      !!init && setPrompts([findMap(user.gamesaves[0].x, user.gamesaves[0].y).description, findMap(user.gamesaves[0].x, user.gamesaves[0].y).name]),
      console.log("GAME LOADED: ", user.gamesaves[0])
    ) : (
      console.log("Coordinates validation failed... Adjusting..."),
      setCoords({...user.gamesaves[0], x: 0, y: 0}),
      setCurrentLocation(findMap(0,0)),
      !!init && setPrompts([findMap(0,0).description, findMap(0,0).name]),
      console.log("Gamesave not detected... Restarting game", coords)
    ))
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

  // const saveDrops = () => {
  //   return !!coords.id ? FETCHUP(`/game_drops/${coords.id}`, "PATCH", coords.drops, game => {console.log("DROPS")}) : false;
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
      !!filterDirection.length && cmdMove(filterDirection[0]);

      const filterOpenChest = splitInput.filter(input => input === "open" || input === "chest")
      // // !!filterOpenChest.length && cmdOpenChest();
      filterOpenChest.length >= 2 && cmdOpenChest()

      const filterLoot = splitInput.filter(input => input === "take" || input === "loot")
      const splitLootInput = playerInput.toLowerCase().split(/take |loot /).pop()
      !!filterLoot.length && cmdLoot(splitLootInput)

      // * Clear input bar
      setPlayerInput("");

      // * ERROR HANDLING
      filterOpenChest.length >= 2 || ![...filterHelp, ...filterSave, ...filterLoad, ...filterDirection,/* ...filterOpenChest,*/ ...filterLoot].length && errPrompt();
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
      ".save - save game",
      ".load - load game",
      ".help - show this menu",
      "Commands:",<br />,
      "\"take\" or \"loot\" item",
      "\"open chest\"",
      "Environment:",<br />,
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
    !!user.gamesaves.length && user.gamesaves[0].x != null ? 
      setPrompts([findMap(user.gamesaves[0].x, user.gamesaves[0].y).description, findMap(user.gamesaves[0].x, user.gamesaves[0].y).name, <br />, "Game loaded." ,"> "+playerInput, ...prompts])
       : 
      setPrompts([findMap(0,0).description, findMap(0,0).name, <br />, "Game loaded." ,"> "+playerInput, ...prompts])
  }

  const errPrompt = () => {
    setPrompts(["You can't do that...", <br />, "> "+playerInput, ...prompts])
  }

  const cmdOpenChest = () => {
    const unlootedDrops = currentLocation.drops.filter(currentLocationDrop => !coords.drops.some(gameStateDrop => gameStateDrop.id === currentLocationDrop.id))
  
    // ! [DEPRECATED] -- No longer working after persisting inventory -- Two identical instances of an object do not evaluate `true`
    /* !!currentLocation.drops.length ? setPrompts([currentLocation.drops.map(drop => !coords.drops.includes(drop) && <li key={drop.id}>{drop.name}</li>), "You opened the chest. Inside, you see:", <br />, "> "+playerInput, ...prompts]) : errPrompt(); */
    // ! ----------->

    // ! [DEPRECATED] -- No longer working after persisting inventory -- Two identical instances of an object do not evaluate `true`
    /* !!currentLocation.drops.filter(drop => !coords.drops.includes(drop)).length ? */
    /* !!currentLocation.drops.filter(drop => !inventory.includes(drop)).length ? */
    // ! ----------->
    !!unlootedDrops.length ?
    // ! [DEPRECATED] -- Initial proof of concept version
    // setPrompts([currentLocation.drops.map(drop => <li key={drop.id}>{drop.name}</li>), "You opened the chest. Inside, you see:", <br />, "> "+playerInput, ...prompts]) 
    // ! ----------->
      setPrompts([unlootedDrops.map(drop => <li key={drop.id}>{drop.name}</li>), "You opened the chest. Inside, you see:", <br />, "> "+playerInput, ...prompts]) 
    : 
      setPrompts([`You opened the chest. Inside, you see... A reflection. Emptiness. *staresoffintothedistance*`, <br />, "> "+playerInput, ...prompts])
  }

  const cmdLoot = (lootQuery) => {    
    let lootItem = currentLocation.drops.find(drop => drop.name.toLowerCase().includes(lootQuery))

    return !!lootItem && !coords.drops.find(drop => drop.id === lootItem.id) ? setPrompts([`You have obtained ${lootItem.name}`, <br />, "> "+playerInput, ...prompts]) & setCoords({...coords, drops: [...coords.drops, lootItem]}) : errPrompt();

    // ! [DEPRECATED] -- No longer working after persisting inventory -- Two identical instances of an object do not evaluate `true`
    // return !!lootItem && !coords.drops.includes(lootItem) ? setPrompts([`You have obtained ${lootItem.name}`, <br />, "> "+playerInput, ...prompts]) & setCoords({...coords, drops: [coords.drops, lootItem]}) : errPrompt();
    // return !!lootItem && !inventory.includes(lootItem) ? setPrompts([`You have obtained ${lootItem.name}`, <br />, "> "+playerInput, ...prompts]) & setInventory([...inventory, lootItem]) : errPrompt();
    // ! ----------->

    // ! [DEPRECATED] -- Alternative/Potential solves to select query Object from Drops
    // currentLocation.drops.find(drop => drop.name.toLowerCase().includes(playerInput.toLowerCase().split(/ |loot|take/).filter(input => input != null).join(' ')))
    // currentLocation.drops.find(drop => drop.name.toLowerCase().includes(playerInput.toLowerCase().split(/loot|take/).pop()))

    // currentLocation.drops.find(drop => drop.name.toLowerCase() )
    // findMap(coords.x, coords.y).drops.find(drop => drop.name.toLowerCase() === playerInput.split(/ |loot/))
    // ! ----------->
    
    // ! CONCEPT
    // if playerInput .includes(worldmaps.drops.split(" ")) && !coords.drops.includes(worldmaps.drops) {
    //   setCoords({...coords, drops: [...coords.drops, worldmaps.drops.find(playerInput)]})
    // }
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