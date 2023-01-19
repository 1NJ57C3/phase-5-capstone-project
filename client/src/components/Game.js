import { useState, useEffect, useCallback, useMemo } from "react";
import PromptCard from "./PromptCard";

function Game({ FETCHDOWN, FETCHUP, FETCHDELETE, user, setUser, worldmaps, setWorldmaps }) {
  const [playerInput, setPlayerInput] = useState("");
  const [gameState, setGameState] = useState({}) // * GameID (if applicable), player's current coordinates, and player's inventory (items)
  const [currentLocation, setCurrentLocation] = useState({}) // * worldmap that matches player's current coordinates
  const [prompts, setPrompts] = useState([]) // * Messages displayed in Game terminal, renders in reversed order

  const findMap = useCallback((x, y) => {
    // * Find worldmap that matches coordinates (params)
    return !!worldmaps.length && worldmaps.find(map => map.x === x && map.y === y);
  }, [worldmaps]);

  const startingMap = useMemo(() => findMap(0,0), [findMap]);
  const gamesave = user.gamesaves[0];
  const gamesaveValidated = !!user.gamesaves.length && typeof(gamesave.x) === 'number' && typeof(gamesave.y) === 'number';
  const gridItems = currentLocation.items;
  const playerItems = gameState.items;

  const Prompt = useMemo(() => {
    class Prompt {
      constructor({ type="output", actor=null, content }) {
        this.type = type;
        this.actor = actor;
        this.content = content;
      }
    }    
    return Prompt;
  }, []);

  const newGamePrompt = useMemo(() => new Prompt ({ actor: startingMap.name, content: startingMap.description }), [Prompt, startingMap]);
  const loadPrompt = useMemo(() => !!gamesave && new Prompt({ actor: findMap(gamesave.x, gamesave.y).name, content: findMap(gamesave.x, gamesave.y).description }), [Prompt, findMap, gamesave]);
  const inputPrompt = new Prompt({ type: 'input', content: playerInput });
  const errorPrompt = new Prompt({ content: "You can't do that..." });

  useEffect(() => {
    // * Logged in, so <Game /> component can now access and load Worldmaps
    FETCHDOWN({ URL: "/worldmaps", ACTION: setWorldmaps, SKIPERRORHANDLING: true });
  }, [FETCHDOWN, setWorldmaps]);

  const handleNewGame = useCallback((init=false) => {
    console.log("INITIALIZING NEW GAME");
    setGameState({ x:0, y:0, user_id: user.id, items: [] });
    setCurrentLocation(startingMap);

    if (!!init) {
      setPrompts([ newGamePrompt ]);
      console.log("GAME STARTED");
    } else {
      console.error("Unable to load Gamesave... GAME RESTARTED");
    }
  }, [newGamePrompt, startingMap, user.id]);

  const handleLoadGame = useCallback((init=false) => {
    console.log("INITIALIZING LOAD GAME SEQUENCE");
    setGameState({ ...gamesave });
    setCurrentLocation(findMap( gamesave.x, gamesave.y ));
    !!init && setPrompts([ loadPrompt ]);
    console.log("GAME LOADED: ", gamesave);
  }, [findMap, gamesave, loadPrompt]);

  const handleLoadValidation = useCallback((init=false) => {
    !!gamesave && console.log("Existing save detected.");

    if (gamesaveValidated) {
      console.log("Coordinates validation complete.");
      handleLoadGame(init);
    } else {
      console.error("Coordinates validation failed... Adjusting...");
      handleNewGame(init);
    };
  }, [gamesave, gamesaveValidated, handleLoadGame, handleNewGame])

  useEffect(() => {
    // * New gamesaves stay pristine until player saves. Old gamesaves get loaded. Less visual bloat at GameMenu.
    handleLoadValidation("init");
  }, [handleLoadValidation]);

  const handleSaveGame = () => {
    // * if Game ID exists in gameState state
    if (!!gameState.id) {
      // * update corresponding save.
      FETCHUP({ URL: `/gamesaves/${gameState.id}`, METHOD: "PATCH", OBJ: gameState, ACTION: game => {
        console.log("SAVED (UPDATED) GAME AT: ", game)
        setUser({ ...user, gamesaves: user.gamesaves.map(g => g.id === game.id ? game : g) })
      }})
     } else {
      // * Otherwise, create new save.
      FETCHUP({ URL: `/gamesaves/`, METHOD: "POST", OBJ: gameState, ACTION: game => {
        console.log("SAVED NEW GAME: ", game)
        setUser({ ...user, gamesaves: [game] })
        setGameState({ ...gameState, id: game.id })
     }})
    };
    console.log("OLD COORDS AT SAVE: ", gamesave);
    console.log("NEW COORDS AT SAVE: ", gameState);
  };

  const forceKeepFocus = (e) => {
    e.target.focus();
  };

  const handleInputChange = (e) => {
    setPlayerInput(e.target.value);
  };

  const handleInputSubmit = (e) => {
    if (e.key === "Enter") {
      const splitInput = playerInput.toLowerCase().split(/\s/g);

      const filterHelp = splitInput.filter(input => input === ".help");
      !!filterHelp.length && cmdHelp();

      const filterSave = splitInput.filter(input => input === ".save");
      !!filterSave.length && cmdSave();

      const filterLoad = splitInput.filter(input => input === ".load");
      !!filterLoad.length && cmdLoad();

      const filterDirection = [ ...playerInput.matchAll(/north|east|south|west/g) ];
      !!filterDirection.length && cmdMove(filterDirection[0][0]);

      const filterOpenChest = splitInput.filter(input => input === "open" || input === "chest");
      filterOpenChest.length >= 2 && cmdOpenChest();

      const filterLoot = splitInput.filter(input => input === "take" || input === "loot");
      const filterLootItem = splitInput.filter(input => input !== "take" && input !== "loot");
      !!filterLoot.length && cmdLoot(filterLootItem);

      // * Clear input bar
      setPlayerInput("");

      // * ERROR HANDLING
      (filterOpenChest.length >= 2 || ![...filterHelp, ...filterSave, ...filterLoad, ...filterDirection, ...filterOpenChest, ...filterLoot].length) && handleOutput(errorPrompt);
    }
  };

  const handleMove = (direction) => {
    const newGameState = (/^north+/gi).test(direction) && currentLocation.north ? { ...gameState, y: gameState.y + 1 }
      : (/^south+/gi).test(direction) && currentLocation.south ? { ...gameState, y: gameState.y - 1 }
      : (/^east+/gi).test(direction) && currentLocation.east ? { ...gameState, x: gameState.x + 1 }
      : (/^west+/gi).test(direction) && currentLocation.west && { ...gameState, x: gameState.x - 1 };
    
    if (!!Object.keys(newGameState).length && currentLocation[direction]) {
      const newLocation = findMap(newGameState.x, newGameState.y);
      const output = new Prompt({ actor: newLocation.name, content: newLocation.description});
      
      setGameState(newGameState);
      setCurrentLocation(newLocation);
      handleOutput(output);
    } else {
      handleOutput(errorPrompt);
    }
  };

  const handleLoot = (lootQuery) => {
    const targetItem = gridItems.find(item => item.name.toLowerCase().includes(lootQuery));
    const lootPrompt = new Prompt({ content: `You have obtained ${targetItem.name}` });
    const failPrompt = new Prompt({ content: `You're already holding the ${targetItem.name}...` });

    return !!targetItem && !playerItems.find(item => item.id === targetItem.id) ? (
      setGameState({ ...gameState, items: [...playerItems, targetItem] }),
      handleOutput(lootPrompt)
    ) : handleOutput(failPrompt);
  };

  const handleOutput = output => {
    setPrompts([ output, inputPrompt, ...prompts ])
  };

  const cmdHelp = () => {
    // TODO Consider moving prompts to back-end, this information can be fetched from our API as JSON
    const description = new Prompt({
      content: "In order to progress, you must type phrases with the following key words. Commands can only be used on their own."
    })
    const movement = new Prompt({
      actor: "Movement:",
      content: " * North\n * East\n * South\n * West"
    })
    const environment = new Prompt({
      actor: "Environment:",
      content: " * open chest\n * take/loot item"
    })
    const commands = new Prompt({
      actor: "Commands:",
      content: " * .help - View this menu\n * .load - load game\n * .save - save game"
    })
    
    setPrompts([ commands, environment, movement, description, inputPrompt, ...prompts ]);
  };

  const cmdMove = (direction) => {
    handleMove(direction);
  };

  const cmdSave = () => {
    const output = new Prompt({ content: "Game saved." });
    handleSaveGame();
    handleOutput(output);
  };

  const cmdLoad = () => {
    const output = new Prompt({ content: "Game loaded."});
    handleLoadValidation();
    setPrompts([ (gamesaveValidated ? loadPrompt : newGamePrompt), output, inputPrompt, ...prompts ]);
  };

  const cmdOpenChest = () => {
    // TODO Incomplete logic - Needs error verification & handling -- Does this grid even HAVE a chest?!
    const unlootedItems = gridItems.filter(gridItem => playerItems.some(playerItem => gridItem.id !== playerItem.id));
      // * Show gridItems where the following is true : playerItems have an item where ... gridItem's id does not match any playerItem's id
    const chestOpenPrompt = new Prompt({ content: `You opened the chest. Inside, you see: ${unlootedItems.map(drop => <li key={drop.id}>{drop.name}</li>)}`});
    const chestFailPrompt = new Prompt({ content: `You opened the chest. Isside, you see... A reflection. Emptiness. *staresoffintothedistance*`});

    // TODO potential solve for chest validation
    // if (currentLocation.entities.includes('treasure chest')) {

    if (!!gridItems.length) {
      setPrompts([ !!unlootedItems.length ? chestOpenPrompt : chestFailPrompt, inputPrompt, ...prompts ]);
    } else {
      handleOutput(errorPrompt);
    }
  };

  const cmdLoot = (lootQuery) => {
    !!lootQuery.length && !!gridItems.length ? handleLoot(lootQuery) : handleOutput(errorPrompt);
  };

  return (
    <div className="Game" onClick={e => console.log(e)}>
      <div className="game-prompts">
        {prompts.map((prompt, i) => <PromptCard key={"prompt"+i} promptObj={prompt} />)}
        <div className="game-help">
          To move in a direction, type a cardinal direction into the terminal and press enter. For example, "Go North" and press the "Enter" key.<br />
          Type ".help" at any time to see a list of commands.<br />
        </div>
      </div>
      <div className="game-input">
        <>&gt;&nbsp;</>
        <input id="game-input" type="text" onChange={handleInputChange} onKeyDown={handleInputSubmit} value={playerInput} autoComplete="off" onBlur={forceKeepFocus} autoFocus />
        <>&nbsp;&nbsp;</>
      </div>
    </div>
  );
}

export default Game;