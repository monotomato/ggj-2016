import {InputMan} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';
import {AudioMan} from 'Managers/AudioManager';
import {ResourceMan} from 'Managers/ResourceManager';

import {resources} from 'Managers/ResourceManager';
import {Scripts} from 'Scripts/Scripts';
import {Entity} from 'Entity';
import {Game} from 'Game';
import {log} from 'Log';

import cfg from 'config.json';


// Pixi setup
PIXI.utils._saidHello = true; // Keep console clean
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

// Renderer
const redOpt = cfg.renderer.options;
redOpt.resolution = window.devicePixelRatio || 1;
const renderer = PIXI.autoDetectRenderer(cfg.renderer.size.x, cfg.renderer.size.y, redOpt);

// Managers
/* TODO: Figure out way to prioritize manager init.
Now resman init is called before anything else manually.
Luckily, resman does not need to update itself. */
const managers = [
  InputMan,
  EventMan,
  AudioMan
];

// Stage
let game;

// Times
const loopInterval = 1000 / cfg.fps;
let lastFrame = 0;

// Main entry
function main() {
  log.info(`Target fps: ${cfg.fps}`);
  document.body.appendChild(renderer.view);

  ResourceMan.init().then(() => {
    const manPromises = managers.map(man => man.init());

    Promise.all(manPromises).then(function(values) {
      managers.forEach(man =>{
        EventMan.registerListener(man);
      });
      // All manger inits are done, start the game!
      initReady();
    });
  });

}

function initReady() {
  log.info('Initialization ready!');
  //console.clear(); // Clears the console.
  game = new Game();
  requestAnimationFrame(loop);
}

let delta = 0;
function loop(ctime) {
  delta += ctime - lastFrame;

  while (delta > loopInterval) {
    update(loopInterval);
    delta -= loopInterval;
    draw();
    managers.forEach((man) => {
      man.update();
    });
  }
  lastFrame = ctime;

  // if(ctime - lastFrame > loopInterval) {
  //   lastFrame = ctime;
  //   update(delta);
  //   draw();
  //   Input.update();
  //   EventManager.delegateEvents();
  // }
  requestAnimationFrame(loop);
}

function update(delta) {
  game.update(delta);
}

function draw() {
  game.render(renderer);
}

main(); // Main entry
