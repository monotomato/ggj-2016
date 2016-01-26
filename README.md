# ES6 Game Seed #
> Simple seed project for ECMAScript 6 game development using Pixi.js and Physics.js.

## Usage ##

After [forking](https://guides.github.com/activities/forking/) the project, use the following commands to get started:

``` Bash
$ npm init   # Initialize project
$ gulp       # Cleans and builds app
$ gulp watch # Starts test server and watches for changes
```

Your browser should then direct you to the correct address.

### Gulp ###
``` Bash
$ gulp         # Cleans and builds app
$ gulp html    # Updates index.html
$ gulp watch   # Watches for changes and starts server
$ gulp res     # Creates spritesheet and resource filelist. Copies all res to build.
```

### Recommended Tools ###
* [Audiosprite](https://www.npmjs.com/package/audiosprite)
* [Tiled](http://www.mapeditor.org)
* [Spritesmith](https://www.npmjs.com/package/gulp.spritesmith)

### Notes ###
* All loaded resources are referenced by their filename, no extension.
    * For example, the animation `"res/sprite/enemy/anim_enemy_id.json"` would be loaded and used as `"anim_enemy_id"`
    * Because of this, it is important that there are no two resources with same filename (even with different extensions).
* Spritesheet `res/sprite.json` is manually defined in `src/config.json` file.
* Json files in `/src` folder are injected into compiled code. Useful for stuff needed before init.
* Json files in `/res` folder are copied to `/build/res` and loaded with `Loader.js` at init.

## Naming Conventions ##

| Resource  | Convention    | Notes            |
|-----------|---------------|------------------|
| Animation | anim_*.json   | See file formats |
| Entity    | entity_*.json | See file formats |
| Audio     | audio_\*.wav  | Most audio extensions supported |
| Sprite    | sprite_*.png  | -                |

## File formats ##
* Animation
``` javascript
  // anim_player_idle.json
  {
    "anim":[
      {"frame":"debug_4", "duration":50},
      {"frame":"debug_3", "duration":50},
      {"frame":"debug_2", "duration":50},
      {"frame":"debug_3", "duration":50}
    ],
    "speed":1
  }
```
* Entity configuration
``` javascript
  // entity_player.json
  {
    "component_configuration":{
      // Here is all configuration handles.
      // Data will be loaded from other file (eg. anim_player_idle)
      "animation": "anim_player_idle"
    },
    "component_data":{
      // Here is all configuration data that don't need its own file.
      "position":{
        "x":50,
        "y":50
      }
    }
  }
```

## Libraries ##
* [Pixi.js](http://www.pixijs.com) - [docs](http://pixijs.github.io/docs/)
* [Physics.js](http://wellcaffeinated.net/PhysicsJS/) -  [docs](https://github.com/wellcaffeinated/PhysicsJS/wiki)
* [Howler.js](https://github.com/goldfire/howler.js/) -  [docs](https://github.com/goldfire/howler.js/)
