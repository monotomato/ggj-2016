import {log} from "Log";
import {ScriptSystem} from "Systems/ScriptSystem";
import {EventSystem} from "Systems/EventSystem";
import {Entity} from "Entity";
import {Scripts} from "Scripts/Scripts";
import {EventMan} from "Managers/EventManager";
import {resources} from "Managers/ResourceManager";
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

    if (cfg.debugMode) this.debugConstructor();
  }

  debugConstructor() {
    let testEntity = Entity.fromConfig('entity_player');
    testEntity.setSprite('debug_2');
    testEntity.addScript("inputScript", {a: 'b', c: 'd'});
    testEntity.eventTypes.push("foo_bar_baz");
    log.debug(testEntity);
    this.addEntityToWorld(testEntity);
  }

  addEntityToWorld(entity) {
    EventMan.registerListener(entity);
    this.world.addChild(entity);
  }

  update(delta) {
    this.systems.forEach((system) => {
      system.update(this.world, this.world, delta);
    });
  }

  render(renderer) {
    renderer.render(this.stage);
  }
}

export {Game};
