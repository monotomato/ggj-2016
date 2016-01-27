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
const managers = [
  ResourceMan,
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
  log.test();
  log.info(`Target loop interval: ${loopInterval}`);
  document.body.appendChild(renderer.view);

  const manPromises = managers.map(man => man.init());
  log.debug(manPromises);

  Promise.all(manPromises).then(function(values) {
    // All manger inits are done, start the game!
    initReady();
  });
}

function initReady() {
  log.info("Initialization ready!");
  log.debug(ResourceMan);
  game = new Game();

  requestAnimationFrame(loop);
}

function loop(ctime) {
  const delta = ctime - lastFrame;

  if(ctime - lastFrame > loopInterval) {
    lastFrame = ctime;
    update(delta);
    draw();
    managers.forEach((man) => {
      man.update();
    });
  }
  requestAnimationFrame(loop);
}

function update(delta) {
  game.update(delta);
}

function draw() {
  game.render(renderer);
}

main(); // Main entry
