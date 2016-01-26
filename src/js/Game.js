import {log} from "Log";
import {ScriptSystem} from "Systems/ScriptSystem";
import {Entity} from "Entity";
import {Scripts} from "Scripts/Scripts";
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

    if (cfg.debugMode) this.debugConstructor();
  }

  debugConstructor() {
    let testEntity = Entity.fromConfig('entity_player');
    testEntity.setSprite('debug_2');
    let testScript = new Scripts["inputScript"]({a: 'b', c: 'd'});
    testEntity.scripts.push(testScript);
    this.world.addChild(testEntity);
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
