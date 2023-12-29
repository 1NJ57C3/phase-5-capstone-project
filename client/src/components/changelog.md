**Back-End (API)**
`gamesave_serializer.rb`
- Removed `:user_id` from output

**Front-End (Client)**
`Game.js`
- `handleInputSubmit()`
  - Refactored `filterOpenChest` from `.filter()` to RegEx `.test()` and adjusted error handling appropriately
  - Refactored `filterDirection` from `.matchAll()` to `match()` and adjusted error handling from 
  - Refactored, consolidating loose `cmdXYZ()` calls and `error handling` into `switch statement`
- `handleMove()`
  - Refactored `newGameState` into significantly more clear and concise `switch statement` from complex ternary chain
- `cmdLoot()`
  - Removed unnecessary use of `.length` from `lootQuery` validation
- Bug Discovered:  
  - Saving a new game as a new user causes a rerender that breaks app
    - Source discovered: `handleLoadValidation()` is being called extraneously by `useEffect()` due to dependencies in array

**Deployment Preparation (via [render](https://render.com))**
- Back-End (Rails)
  - `config/database.yml`
    - Adjusted `production` database to value of 'DATABASE_URL' in env
  - `config/puma.rb`
    - Uncommented `workers` line and adjusted count to 4 from 2
    - Uncommented `preload_app!`
  - `config/environments/production.rb`
    - Added presence check of 'or RENDER' to value of `config.public_server_file.enabled`
  - `bin/render-build.sh`
    - Created build script
  - `render.yaml`
    - Created deployment 'services declaration' file for automation

<hr>

**Back-End (API)**  
- Generated resources for `entities`, `world_entities`, and `entity_items`  
  - Specified appropriate `routes` and wrote corresponding `controller`s with strong params  
  - Adjusted `serializers` as needed  
- Added/adjusted presence and inclusion validations to include every column of `worldmap`, `user`, `gamesave`, and `item` tables to models  
- `game_items_controller`  
  - Updated `pos_params` (possession) to `item_params`  
- `worldmaps_controller`  
  - Added inclusion of `entities.items` to `index` and `show`  
- `user`  
  - Removed unused/commented code  
- `worldmap_serializer`  
  - Added `entities` and removed `items` associations  
- `seeds.rb`  
  - Disassociated `items` from `worldmaps`  
  - Added `entities` with `items`  
  - Changed test `user`names  
  
**Front-End (Client)**  
`Game.js`  
- Replaced `gridItems` variable (deprecated) with `chestItems`  
- Wrote new `gridItems` variable for `Loot` command chain and handler  
- `cmdOpenChest`  
  - Updated `gridItems` references to `chestItems`  
  - Adjusted `unlootedItems` filter condition to work more consistently  
    Instead of evaluating playerItems for mismatched item ids, we now evaluate for absence of matching id's  
    - Updated comment accordingly for assistance in reading this chain in a clear and concise way  
  - Removed TODO comments, as they've been resolved (yay!)  
  - Bugfix: Using this command on maps with no `container` `entities` generates a breaking console error  
    - Added `optional chaining` operator (`?.`) to `if` statement condition  
    - Moved variable assignments into `if` statement  
- `cmdOpenChest`  
  - Bugfix: Using this command on maps with no `items` generates a breaking console error  
    - Added `?.` operator to `chestItems.length`  
- `handleMove`  
  - Commented out `newGameState` validation with TODO to reevaluate for clutter  
- `handleLoot`  
  - Added `?.` operator to Prompts  
  - Bugfix: Conditional ternary was not working correctly (`targetItem` was returning false but truthy codeblock ran anyway)  
    - Converted to `if/else` statement and separated `targetItem` into guard clause  
  - Added inverted logic to `targetItem` for greater flexibility in player input structure  
- `handleInputSubmit`  
  - Bugfix: Console error when attempting to use take or loot keywords with a query containing multiple words  
    - Added join to `cmdLoot` call argument  
- `handleOutput`  
  - Added logic to clean up function calls - if `output` is an object and not an array, wrap `output` with array  
  - Removed array brackets from calls to this function where unnecessary  
  
<hr>

**Front-End (Client)**  
`Game.js`  
- `useEffect`s have been moved down, between `functions` and `return`ed JSX  
- `Prompt`s have been renamed to eliminate some ambiguity  
  - `newGamePrompt` => `newGameMapPrompt`  
  - `loadPrompt` => `loadGameMapPrompt`  
  - `inputPrompt` => `playerInputPrompt`  
  - `errorPrompt` => `errorOutputPrompt`  
- `gamesaveValidated` variable adjusted to check for valid map, rather than type of coordinate values in gamesave  
- `loadGameMapPrompt`converted from `useMemo` to `useCallback` that takes a `game` as an argument to eliminate `gamesave` dependency  
- `errorOutputPrompt` no longer requires `useMemo` wrapper; removed the extra
- `handleNewGame`  
  - removed unnecessary `else` statement  
- `handleLoadGame`  
  - Added `game` argument to eliminate `gamesave` dependency and increase reusability  
- `handleLoadGameValidation`  
  - Adjusted order of `if/else` conditions  
  - Adjusted `if/else` conditions for increased readability  
  - Added `game` argument to eliminate `gamesave` dependency and increase reusability  
  - Added `validator` argument to eliminate `gamesaveValidated` dependency  
  - Now takes an Object instead of individual parameters for increased readability  
  - Adjusted verbiage in console/debug messages  
- `handleInputSubmit`  
  - `filterDirection` and its `handleMove` function call have been adjusted for case-insensitivity  
  - `filterOpenChest` no longer disabled via `Error Handling` logic  
- `handleMove`  
  - Adjusted RegEx for each direction to check for just the starting letter instead of entire word  
- `handleOutput`  
  - Adjusted to take array of objects (`output`) instead of single object as argument  
  - Updated arguments of function calls in `handleInputSubmit`, `handleMove`, `handleLoot`, `cmdSave`, `cmdOpenChest` and `cmdLoot` accordingly  
- `cmdHelp`, `cmdLoad`, `cmdOpenChest`  
  - Replaced `setPrompts` with updated `handleOutput`, updated arguments accordingly  
  - Removed leading whitespaces in `cmdHelp` output prompts' content  
- `cmdLoad`  
  - Updated `handleLoadValidation` function call with object  
  - Corrected `output`/`prompt` logic -- failure to validate gamesaves on player-requested load will no longer automatically start a new game  
- `cmdOpenChest`  
  - Adjusted `unlootedItems` comment for clarity/readability and conciseness  
  - Adjusted formatting in `chestOpenPrompt` -- now returns a bulleted list in plain JSON text with line breaks  
  - Extracted `.map` logic from `chestOpenPrompt` into locally scoped variable, `unlootedItemsList`  
  - Corrected typo in `chestFailPrompt`  

**Bugfixes:**  
- `cmdSave` no longer triggers `useEffect` rerender  

**Back-End (API)**  
`gamesaves_controller.rb`  
- `save_gs_items()`  
  - Renamed parameter in `.each` method call from `d` to `item`  
- `gamesave.rb`  
  - Added `, dependent: :destroy` to `:items, through:` association  
  
<hr>

**Front-End (Client)**  <!--Pushed to WIP>
  
`Game.js`  
- `handleNewGame`  
  - Removed old/commented out code  
  - Added `init`ialize? parameter with default of `false`  
    - Added `init` logic to last debug/console messages  
- `handleLoadGame`  
  - Added extra debug line to indicate existence of `gamesave` before validation check runs  
  - Adjusted dependency array to reflect changes  
- `handleLoadValidation`  
  - Replaced pure gamesave validation logic with `gameSaveValidated` variable for readbility and reusability  
  - Validation failure now calls `handleNewGame` with `init` parameter pass-through  
  - Converted from ternary expression to if/else statement for increased readability  
- `cmdLoad`  
  - `gamesaveValidated` extracted to parent function for reusability  
  - Updaetd to call `handleLoadValidation` instead of `handleLoadGame`  
- `handleInputSubmit`  
  - Removed old/commented out code  
  
  **Back-End (API)**
`seeds.rb`  
- `description` of `m7` has been made more concise  

<hr>

Core Functionality Refactor/Revamp  
  
**Front-End (Client)**  
  
**General Changes**:  
- Renamed functions and variables for improved readability  
  - coords => gameState  
  - newGame() => handleNewGame()  
  - loadGame() => handleLoadGame()  
  - saveGame() => handleSaveGame()  
  - handleUpdateCoords() + handleUpdateLocation() => handleMove()  
  - errPrompt() => handleOutput() (\**Refactor*)  
- Modified `FETCH` functions to take named parameters for improved readability  
- Began writing `README`  
  
`PromptCards.js`  
- New component to handle rendering of game `Prompt`s  
  
`Game.js`  
- `Prompts` are no longer an array of hard-coded `strings` from commands; instead, they are constructed `Objects` that are rendered using `PromptCards` component  
- `filterDirection` and handlers for player movement have been adjusted for keyword recognition to be slightly more forgiving of typos  
- `cmdMove` handlers have been consolidated and adjusted so that `gameState` Objects are no longer mutated directly  
- Simplified `game-input` div/nesting structure and adjusted appropriate CSS  
- Populated `useEffect` dependency arrays and applied `useMemo` and `useCallback` where needed  
  
**Back-End (API)**  
  
**General Changes**:  
- Renamed and adjusted `Tables` with corresponding `Controllers`/`Models`/`Serializers`/`Routes` for improved readability  
- `seeds` have been adjusted for renaming of tables  
  
**Miscellaneous Changes**  
- Created a `.dbml` (currently stored in root folder) file to generate ERD with [dbdiagram](https://dbdiagram.io) for ease of further revamping/development  