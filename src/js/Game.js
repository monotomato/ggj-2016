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
    log.debug('CONSTRUCTOR');
    this.stage = new Entity();
    this.ui = new Entity(); //new Entity('entity_ui');
    this.stage.addChild(this.ui);
    this.world = new Entity();
    this.world.addScript('cameraScript', {});
    this.stage.addChild(this.world);

    this.systems = [];

    let eventSystem = new EventSystem();
    this.systems.push(eventSystem);

    log.debug("PHYSICS");
    let physicsSystem = new PhysicsSystem();
    this.systems.push(physicsSystem);
    
    let scriptSystem = new ScriptSystem();
    this.systems.push(scriptSystem);


    log.debug("MMMMM");

    log.debug('Debug mode');
    if (cfg.debugMode) this.debugConstructor();
  }

  debugConstructor() {
    this.addEntityToWorld(this.loadMap('testmap'));
    this.stage.init(this.stage);
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
    console.log(resources);
    let eMap = new Entity();
    log.debug(mapname);
    resources[mapname].data.layers.forEach(layer => {
      let eLayer = new Entity();
      // console.log(layer);
      if (layer.type === 'imagelayer'){
        let imagename = layer.image.split('.')[0];
        let sprite = new PIXI.Sprite();
        sprite.texture = resources[imagename].texture;
        eLayer.addChild(sprite);
      }
      else if (layer.type === 'objectgroup'){
        layer.objects.forEach(obj => {
          let eObj = Entity.fromTiledObject(obj);
          eLayer.addChild(eObj);
        });
      }
      eMap.addChild(eLayer);
    });
    log.debug(eMap);
    return eMap;
  }

}

export {Game};
