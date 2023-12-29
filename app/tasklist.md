## Tasks
  ### general
  - Deployment
    - [x] Prep
    - [ ] Deployment/Activation
  ### frontend
    ### bugfixes
    - Bugfix: Rework `useEffect` logic for new gamesaves
      Due to the inclusion of `user` in our `useEffect` dependencies for automatically loading the player's most recent save or starting a new game, saving the game as a new user causes a rerender that throws a breaking error.
      - [ ] New user save no longer breaks app
      - [ ] Saves under normal circumstances continue to function normally
    ### features
    - Feature: Interactible Objects
      In order for gameplay to be compelling, an RPG needs obstacles. Interactible objects, such as doors, switches, levers, and locks, are good examples of such obstacles.
      - Door
        - [ ] Create a door object
        - [ ] Door can be opened and closed
        - [ ] Player cannot traverse through closed door
        - [ ] Player can traverse through open door
      - Switch
        - [ ] Create a switch object
        - [ ] Switch can be activated
        - [ ] Switch can be deactivated
      - Lock
        - [ ] Door can be locked
        - [ ] Door cannot be opened when locked
        - [ ] Door can be unlocked
        - [ ] Door can be opened when unlocked
        - [ ] Switch can lock door
        - [ ] Switch can unlock door
        - Key
        - [ ] Create a key object
        - [ ] Key can unlock a specific door
    - Feature: NPCs
      One of the key components in world-building in an RPG is NPCs (non-player characters). These characters are story-telling tools that help to:
      - Drive the game's progression (giving the user quests, providing hints, buying/selling items)
      - Provide backstory for the region (flavor NPCs)
      - Break up monotony (trivial/background NPCs)
      - [ ] Create an NPC object
      - [ ] Place NPC into a grid
      - [ ] Grid prompt should acknowledge NPC's presence
      - [ ] Player can to interact with NPC
        - [ ] Player can ask NPC, "Who are you?"
          - [ ] NPC responds "I'm an NPC!"
        - [ ] Player can ask NPC, "What's an NPC?"
          - [ ] NPC responds "A Non-Player Character."
        - [ ] Player says or asks anything else to NPC
          - [ ] NPC responds with one of the following:
            - "I don't understand..."
            - "Huh?"
            - "I used to be an adventurer like you. Then I took a-- What?"
    - Feature/Rework: Additional Traversal Options
      The idea of traversing the game world by using exclusively cardinal directions limits player's level of immersion. 
      - Non-Cardinal travel commands (i.e. forward, left/right, back)
      - Linked List?
        - {current, prev, null}
    - Player death events
    - Game history between saves?
    ### chores
    - Split Engine code into custom hooks?
    - Refactor for useContext?
  ### backend
    ### optimizations
    - Rails: Implement :accepts_nested_attributes_for