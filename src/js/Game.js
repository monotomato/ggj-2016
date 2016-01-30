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

    let physicsSystem = new PhysicsSystem();
    this.systems.push(physicsSystem);

    let scriptSystem = new ScriptSystem();
    this.systems.push(scriptSystem);


    if (cfg.debugMode) {
      log.debug('Debug mode is ON');
      this.debugConstructor();
    }
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
    // let a = resources[mapname].data.properties.config
    // console.log(a);
    let eMap = new Entity(); //Entity.fromConfig(a);
    log.debug(mapname);
    resources[mapname].data.layers.forEach(layer => {
      let eLayer = new Entity();
      // console.log(layer);
      if (layer.type === 'imagelayer'){
        let imagename = layer.image.split('.')[0];
        let sprite = new PIXI.Sprite();
        sprite.texture = resources[imagename].texture;
        eLayer.position.x = layer.offsetx || 0;
        eLayer.position.y = layer.offsety || 0;
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
