## About ##
Simple seed project for ECMAScript 6 game development using Pixi.js.

## Gulp ##
```
gulp html     # Updates index.html
gulp watch    # Watches for changes and starts server
gulp res      # Creates spritesheet and resource filelist. Copies all res to build.
```
## Notes ##
* All resources are now loaded in a way that allows referencing them only by their filename.
    * Because of that, it is really important that there are no 2 resources with same filename (even with different extensions).

* All files should be referenced by their filename (without extension).
* Spritesheet `res/sprite.json` is manually defined in `src/config.json` file.
* Json files in `/src` folder are injected into compiled code. Useful for stuff needed before init.
* Json files in `/res` folder are copied to `/build/res` and loaded with `Loader.js` at init.

## Fileformats ##
* Animation
```
  # anim_player_idle.json
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
```
  # entity_player.json
  {
    "component_configuration":{
      # Here is all configuration handles.
      # Data will be loaded from other file (eg. anim_player_idle)
      "animation": "anim_player_idle"
    },
    "component_data":{
      # Here is all configuration data that don't need its own file.
      "position":{
        "x":50,
        "y":50
      }
    }
  }
```
