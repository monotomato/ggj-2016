import {log} from "Log";
import {ScriptSystem} from "Systems/ScriptSystem";
import {EventSystem} from "Systems/EventSystem";
import {PhysicsSystem} from "Systems/PhysicsSystem";
import {Entity} from "Entity";
import {Scripts} from "Scripts/Scripts";
import {EventManager} from "EventManager";
import cfg from 'config.json';

class Game {
  constructor() {
    this.stage = new Entity();
    this.ui = new Entity(); //new Entity("entity_ui");
    this.stage.addChild(this.ui);
    this.world = new Entity();
    this.stage.addChild(this.world);

    this.systems = [];
    let scriptSystem = new ScriptSystem();
    this.systems.push(scriptSystem);

    let eventSystem = new EventSystem();
    this.systems.push(eventSystem);

    let physicsSystem = new PhysicsSystem();
    this.systems.push(physicsSystem);

    if (cfg.debugMode) this.debugConstructor();
  }

  debugConstructor() {
    let testEntity = Entity.fromConfig('entity_player');
    testEntity.setSprite('debug_2');
    testEntity.addScript("inputScript", {a: 'b', c: 'd'});
    testEntity.addPhysics('rectangle', {
      x: 0,
      y: 0,
      vx: 0.01,
      width: 64,
      height: 64
    });
    log.debug(testEntity);
    this.addEntityToWorld(testEntity);
  }

  addEntityToWorld(entity) {
    EventManager.registerListener(entity);
    this.world.addChild(entity);
  }

  update(delta) {
    this.systems.forEach((system) => {
      system.update(this.world, delta);
    });
  }

  render(renderer) {
    renderer.render(this.stage);
  }
}

export {Game};
