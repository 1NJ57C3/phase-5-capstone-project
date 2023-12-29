import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import PromptCard from "./PromptCard";

function Game({ FETCHDOWN, FETCHUP, FETCHDELETE, user, setUser, worldmaps, setWorldmaps }) {
  const [playerInput, setPlayerInput] = useState("");
  const [gameState, setGameState] = useState({}); // * GameID (if applicable), player's current coordinates, and player's inventory (items)
  const [currentLocation, setCurrentLocation] = useState({}); // * worldmap that matches player's current coordinates
  const [prompts, setPrompts] = useState([]); // * Messages displayed in Game terminal, renders in reversed order

  const findMap = useCallback((x, y) => {
    // * Find worldmap that matches coordinates (params)
    return !!worldmaps.length && worldmaps.find(map => map.x === x && map.y === y);
  }, [worldmaps]);

  const initsave = useRef(user.gamesaves[0]).current;
  const startingMap = findMap(0,0);
  const gamesave = user.gamesaves[0];
  const gamesaveValidated = !!user.gamesaves.length && !!findMap(gamesave.x, gamesave.y);
  const chestItems = currentLocation.entities?.find(entity => entity.group === "container")?.items;
  const gridItems = currentLocation.entities?.reduce((acc, entity) => [...acc, ...entity.items], []);
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

  const newGameMapPrompt = useMemo(() => new Prompt ({ actor: startingMap.name, content: startingMap.description }), [Prompt, startingMap]);
  const loadGameMapPrompt = useCallback((game) => !!gamesaveValidated && new Prompt({ actor: findMap(game.x, game.y).name, content: findMap(game.x, game.y).description }), [Prompt, findMap, gamesaveValidated]);
  const playerInputPrompt = new Prompt({ type: 'input', content: playerInput });
  const errorOutputPrompt = new Prompt({ content: "You can't do that..." });

  const handleNewGame = useCallback((init=false) => {
    console.log("INITIALIZING NEW GAME");
    setGameState({ x:0, y:0, user_id: user.id, items: [] });
    setCurrentLocation(startingMap);
    if (!!init) setPrompts([newGameMapPrompt]);
    console.log("GAME STARTED");
  }, [newGameMapPrompt, startingMap, user.id]);

  const handleLoadGame = useCallback((game, init=false) => {
    console.log("INITIALIZING LOAD GAME SEQUENCE");
    setGameState({ ...game });
    setCurrentLocation(findMap( game.x, game.y ));
    if (!!init) setPrompts([loadGameMapPrompt(game)]);
    console.log("GAME LOADED: ", game);
  }, [findMap, loadGameMapPrompt]);

  // TODO : RENAME -- This is only supposed to manage `selection` for `game initialization`
  const handleLoadValidation = useCallback(({game, validator, init=false}) => {
    console.log("Checking for valid save file...");
    if (validator) {
      console.log("Validation complete.");
      handleLoadGame(game, init);
    } else if (!validator && !!init) {
      console.log("Validation failed. Adjusting...");
      handleNewGame(init);
    } else if (!validator && !init) {
      console.error("Validation failed. Load sequence aborted.");
      // TODO Add prompt for failure
      // ! `prompts` is dumping whenever we use `handleOutput(errorOutputPrompt);`
    } else {
      console.error('New error found in handleLoadValidation');
    };
  }, [handleLoadGame, handleNewGame]);

  const handleSaveGame = () => {
    // * if Game ID exists in gameState state
    if (!!gameState.id) {
      // * update corresponding save.
      FETCHUP({ URL: `/gamesaves/${gameState.id}`, METHOD: "PATCH", OBJ: gameState, ACTION: game => {
        console.log("SAVED (UPDATED) GAME AT: ", game);
        setUser({ ...user, gamesaves: user.gamesaves.map(g => g.id === game.id ? game : g) });
      }})
    } else {
      // * Otherwise, create new save.
      FETCHUP({ URL: `/gamesaves/`, METHOD: "POST", OBJ: gameState, ACTION: game => {
        console.log("SAVED NEW GAME: ", game);
        setUser({ ...user, gamesaves: [game] });
        setGameState({ ...gameState, id: game.id });
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
      const filterSave = splitInput.filter(input => input === ".save");
      const filterLoad = splitInput.filter(input => input === ".load");
      const filterDirection = playerInput.match(/north|east|south|west/gi);
      const filterOpenChest = (/open.+chest/gi).test(playerInput);
      const filterLoot = splitInput.filter(input => input === "take" || input === "loot");
      const filterLootItem = splitInput.filter(input => input !== "take" && input !== "loot");

      switch (true) {
        case !!filterHelp.length:
          cmdHelp();
          break;
        case !!filterSave.length:
          cmdSave();
          break;
        case !!filterLoad.length:
          cmdLoad();
          break;
        case !!filterDirection:
          cmdMove(filterDirection[0].toLowerCase());
          break;
        case !!filterOpenChest:
          cmdOpenChest();
          break;
        case !!filterLoot.length:
          cmdLoot(filterLootItem.join(' '));
          break;
        default:
          handleOutput(errorOutputPrompt);
          break;
      }

      // * Clear input bar
      setPlayerInput("");

      // ? ERROR HANDLING - introduce `actionFailed` boolean into handlers?
    }
  };

  const handleMove = (direction) => {
    if (currentLocation[direction]) {
      let newGameState = { ...gameState };
      
      switch (direction) {
        case "north":
          newGameState.y += 1;
          break;
        case "east":
          newGameState.x += 1;
          break;
        case "south":
          newGameState.y -= 1;
          break;
        case "west":
          newGameState.x -= 1;
          break;
        default:
          break;
      }

      const newLocation = findMap(newGameState.x, newGameState.y);
      const output = new Prompt({ actor: newLocation.name, content: newLocation.description});
      
      setGameState(newGameState);
      setCurrentLocation(newLocation);
      handleOutput(output);
    } else {
      handleOutput(errorOutputPrompt);
    }
  };

  const handleLoot = (lootQuery) => {
    const targetItem = gridItems.find(item => item.name.toLowerCase().includes(lootQuery) || lootQuery.includes(item.name.toLowerCase()));
      // TODO : convert to RegEx .matchAll() for even greater flexibility?
    const lootPrompt = new Prompt({ content: `You have obtained ${targetItem?.name}` });
    const failPrompt = new Prompt({ content: `You're already holding the ${targetItem?.name}...` });
    
    if (!targetItem) {
      handleOutput(errorOutputPrompt);
    } else if (!playerItems.find(item => item.id === targetItem.id)) {
      setGameState({ ...gameState, items: [...playerItems, targetItem] });
      handleOutput(lootPrompt);
    } else {
      handleOutput(failPrompt);
    };
  };

  const handleOutput = output => {
    if (typeof output === 'object' && !Array.isArray(output)) output = [ output ];
    setPrompts([ ...output, playerInputPrompt, ...prompts ]);
  };

  const cmdHelp = () => {
    // TODO Consider moving prompts to back-end, this information can be fetched from our API as JSON
    const description = new Prompt({
      content: "In order to progress, you must type phrases with the following key words. Commands can only be used on their own."
    })
    const movement = new Prompt({
      actor: "Movement:",
      content: "* North\n* East\n* South\n* West"
    })
    const environment = new Prompt({
      actor: "Environment:",
      content: "* open chest\n* take/loot item"
    })
    const commands = new Prompt({
      actor: "Commands:",
      content: "* .help - View this menu\n* .load - load game\n* .save - save game"
    })
    
    handleOutput([ commands, environment, movement, description ]);
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
    handleLoadValidation({game: gamesave, validator: gamesaveValidated});
    if (gamesaveValidated) handleOutput([ loadGameMapPrompt(gamesave), output ]);
  };

  const cmdOpenChest = () => {
    if (!!chestItems?.length) {
      const unlootedItems = chestItems.filter(chestItem => !playerItems.some(playerItem => chestItem.id === playerItem.id));
        // * Show chestItems where playerItems do not have playerItems that match chestItem's id property
      const unlootedItemsList = unlootedItems.map(item => '• ' + item.name).join('\n');
      const chestOpenPrompt = new Prompt({ content: `You opened the chest. Inside, you see: \n${unlootedItemsList}` });
      const chestFailPrompt = new Prompt({ content: `You opened the chest. Inside, you see... A reflection. Emptiness. *staresoffintothedistance*` });

      handleOutput(!!unlootedItems.length ? chestOpenPrompt : chestFailPrompt);
    } else {
      handleOutput(errorOutputPrompt);
    }
  };

  const cmdLoot = (lootQuery) => {
    !!lootQuery && !!gridItems.length ? handleLoot(lootQuery) : handleOutput(errorOutputPrompt);
  };

  useEffect(() => {
    // * Logged in, so <Game /> component can now access and load Worldmaps
    FETCHDOWN({ URL: "/worldmaps", ACTION: setWorldmaps, SKIPERRORHANDLING: true });
  }, [FETCHDOWN, setWorldmaps]);

  useEffect(() => {
    // * New gamesaves stay pristine until player saves. Old gamesaves get loaded. Less visual bloat at GameMenu.
    handleLoadValidation({game: initsave, validator: gamesaveValidated, init: true});
  }, [
    initsave,
    gamesaveValidated, // !
    handleLoadValidation // !
  ]);

  // ! on new game init
  // ? gamesaveValidated === false
  // ! on new game `.save`
  // ? gamesaveValidated === true

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