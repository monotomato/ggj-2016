import {Entity} from 'Entity';
import {Input} from 'Input';
import {log} from 'Log';
import {loadResources, resources} from 'Loader';
// import {InputScript} from 'Scripts/InputScript';
import {EventManager} from 'EventManager';
import {Scripts} from 'Scripts/Scripts';

// NOTE: This compiles cfg file into the compiled main.js file at compile time.
import cfg from 'config.json';

// Pixi setup
PIXI.utils._saidHello = true; // Keep console clean
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

// Renderer
const redOpt = cfg.renderer.options;
redOpt.resolution = window.devicePixelRatio || 1;
const renderer = PIXI.autoDetectRenderer(cfg.renderer.size.x, cfg.renderer.size.y, redOpt);

// Stage
let stage = new Entity();
let testEntity;

// Times
const loopInterval = 1000 / cfg.fps;
let lastFrame = 0;

// Main entry
function main () {
  log.test();
  log.info(`Target loop interval: ${loopInterval}`);
  document.body.appendChild(renderer.view);
  // renderer.view.webkitRequestFullscreen();
  loadResources(initReady);
}

function initReady(){
  log.info("Initialization ready!");
  log.debug(resources);

  debugInit();
  requestAnimationFrame(loop);
}

function loop (ctime) {
  const delta = ctime - lastFrame;

  if(ctime - lastFrame > loopInterval) {
    lastFrame = ctime;
    update(delta, Input);
    draw();
    Input.update();
    EventManager.delegateEvents();
  }
  requestAnimationFrame(loop);
}

function update (delta, input) {
  debugUpdate();
}

function draw () {
  renderer.render(stage);
}

function debugUpdate(){
  if(Input.keyReleased.up){ testEntity.setSprite('debug_3');}
  if(Input.keyReleased.down){ testEntity.setSprite('debug_1');}
}

function debugInit() {
  testEntity = Entity.fromConfig('entity_player');
  testEntity.setSprite('debug_2');
  log.debug("TestEntity: ");
  log.debug(testEntity);
  testEntity.eventTypes.push('foo_bar_baz', 'plaa');
  EventManager.registerListener(testEntity);
  EventManager.publish({
    eventType: 'foo_bar_baz',
    parameters: {
      hello: "world"
    }
  });
  log.debug(EventManager);
  let testScript = new Scripts["inputScript"]({a: 'b', c: 'd'});
  log.debug(testScript);
  stage.addChild(testEntity);
}

function inputDemo() {
  if(Input.keyPressed.down){ log.debug("Down just pressed!"); }
  if(Input.keyReleased.up){ log.debug("Up just released!"); }
  if(Input.keyDown.right){ log.debug("Right is down!"); }
}
main(); // Main entry
