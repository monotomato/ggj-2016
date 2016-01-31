import {log} from 'Log';
import {ScriptSystem} from 'Systems/ScriptSystem';
import {EventSystem} from 'Systems/EventSystem';
import {PhysicsSystem} from 'Systems/PhysicsSystem';
import {Entity} from 'Entity';
import {Scripts} from 'Scripts/Scripts';
import {EventMan} from 'Managers/EventManager';
import {resources} from 'Managers/ResourceManager';
import cfg from 'config.json';
import {Factory} from 'Factory';

class Game {
  constructor() {
    log.debug('CONSTRUCTOR');
    this.stage = new Entity();
    this.world = new Entity();
    this.world.tags.push('push');
    this.world.addScript('cameraScript', {});
    this.stage.addChild(this.world);


    this.ui = new Entity(); //new Entity('entity_ui');

    this.stage.addChild(this.ui);

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

    let fade = new Entity();
    fade.addBox(0x000000, cfg.renderer.size.x, cfg.renderer.size.y);
    fade.position.x = cfg.renderer.size.x / 2;
    fade.position.y = cfg.renderer.size.y / 2;
    fade.addScript('fadeInScript');

    let darken = new Entity();
    darken.position.x = cfg.renderer.size.x / 2;
    darken.position.y = cfg.renderer.size.y / 2;
    darken.setSprite('sprite_darken');
    darken.addScript('darkenScript');

    let clock = new Entity();
    // clock.addBox(0xFFFFFF, 50, 50);
    clock.setSprite('kello');
    let text = new PIXI.Text('Clockan is kymppi',{font : '24px Arial', fill : 0x222222, align : 'center'});
    text.x = -40;
    text.y = -13;
    clock.addChild(text);
    clock.position.x = cfg.renderer.size.x - 30;
    clock.position.y = cfg.renderer.size.y - 30;
    clock.addScript('dayNightCycleScript');

    let messageBox = new Entity();
    messageBox.addScript('messageBoxScript');
    messageBox.position.x = 60;
    messageBox.position.y = 665;

    let intro = new Entity();
    intro.addScript('introScript');
    intro.position.x = cfg.renderer.size.x / 2;
    intro.position.y = cfg.renderer.size.y / 2 + 30;
    // let bubble = Factory.createSpeechBubble(10, 3, 6, 'The short brown little fox thing jumped over the lazy dog.');
    // bubble.position.x = 480 + 25;
    // bubble.position.y = 320 - 60;
    // this.addEntityToUI(bubble);

    let eventTimer = new Entity();
    eventTimer.addScript('eventTimerScript');
    this.addEntityToWorld(eventTimer);

    this.addEntityToUI(fade);
    this.addEntityToUI(darken);
    this.addEntityToUI(clock);
    this.addEntityToUI(messageBox);
    this.addEntityToUI(intro);
    this.stage.init(this.stage);

    EventMan.publish({eventType: 'intro', parameters: {}});
  }

  addEntityToWorld(entity) {
    // EventMan.registerListener(entity);
    this.world.addChild(entity);
  }

  addEntityToUI(entity) {
    // EventMan.registerListener(entity);
    this.ui.addChild(entity);
  }

  update(delta) {
    this.systems.forEach((system) => {
      system.update(this.world, delta);
      system.update(this.ui, delta);
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
