import {log} from 'Log';
import {ScriptSystem} from 'Systems/ScriptSystem';
import {EventSystem} from 'Systems/EventSystem';
import {PhysicsSystem} from 'Systems/PhysicsSystem';
import {Entity} from 'Entity';
import {Scripts} from 'Scripts/Scripts';
import {EventMan} from 'Managers/EventManager';
import {resources} from 'Managers/ResourceManager';
import cfg from 'config.json';

class Game {
  constructor() {
    this.stage = new Entity();
    this.ui = new Entity(); //new Entity('entity_ui');
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

    let testChest = Entity.fromConfig('entity_item_chest');
    // log.debug(testEntity);
    // this.addEntityToWorld(testEntity);
    // this.addEntityToWorld(testChest);
    this.addEntityToWorld(this.loadMap('testmap'));

  }

  addEntityToWorld(entity) {
    EventMan.registerListener(entity);
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

  loadMap(mapname) {
    let eMap = new Entity();
    resources[mapname].data.layers.forEach(layer => {
      let eLayer = new Entity();
      layer.objects.forEach(obj => {
        let eObj = Entity.fromTiledObject(obj);
        eLayer.addChild(eObj);
      });
      eMap.addChild(eLayer);
    });
    log.debug(eMap);
    return eMap;
  }

}

export {Game};