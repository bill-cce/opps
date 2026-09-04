# OPPS — Claude Code Context

## What This Is

> A text-based street empire builder built for the [Jest platform](https://jest.com) — playable instantly via RCS/iMessage, no app store required. The game shares similarities with Mafia Wars. It is designed to be simple, easy to play, yet have rich grapics capabilities. The game is not synchronous multi-player, it is asynchronous. Will have in app monetization, social features.

## Tech Stack & Tech Requirements

- Vanilla JS, HTML5
- Target platforms: iOS and Android
- JEST SDK integration
- The game must run on as wide a variety of devices as possible. 
- The game must be lightweight, no long loading times or massive memory consumption
- Data driven architecture required. This means new content, missions, progression in the game is driven by content
- JSON is the preferred format for all game data, including in game object prototypes, monetization configuration, store packs, etc. Deviation from JSON is highly discouraged, unless feature requirements cannot be satisfied with JSON. In that case, this rule must be enforced, and if there is an exception, it should be called out specifically.
- game data files (i.e. JSON) may be downloaded from client/users on demand. For example, if we, the developer, make changes to a game data object prototype, that data is deployed to the cloud and is consumable by all clients/users
- The game may use a widely supported and compatible 3D rendering system, such as OpenGL, as long as it is widely supported
- The game supports a CI/CD pipeline that allows for incremental new builds of the application as well as the building of new game data (JSON). The pipeline should condition the data/code, run unit tests, regression tests, and if required, e2e tests. Once the build process is complete, game data or new versions of the game can be deployed to a test or production environment. Preferrably use GitHub for the pipeline.

## Project Structure

```
assets/           # in-game assets, UI buttons, screens, menus, models, textures, etc
  images
  portraits

css/              # self explanatory, for css formatting

data/             # JSON files for game data, can be downloaded remotely as new changes to the game are made


js/               # all game code

server/           # all server code
