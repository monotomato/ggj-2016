## TODO ##
* Animation file stuff
* Spritesheet json loading (Gulp needs to create file with all spritesheet jsons listed)

## About ##
Simple seed project for ECMAScript 6 game development using Pixi.js.

## Gulp ##
```
gulp html    # Updates index.html
gulp watch   # Watches for changes and starts server
gulp res     # Creates spritesheet and copies all res to build
```
## Notes ##
All resources are now loaded in a way that allows referencing them only by their filename. Because of that, it is really important that there are no 2 resources with same filename.
