import {resources} from 'Managers/ResourceManager';
import {log} from 'Log';
import {InputMan} from 'Managers/InputManager';
import {Scripts} from 'Scripts/Scripts';
import cfg from 'config.json';
import {Physics} from 'Physics';
import {EventMan} from 'Managers/EventManager';

class Entity extends PIXI.Container {
  /* TODO: How (and when) initialize scripts? Need planning.
  It cant be done at construction time, as script might need to find other entities.
  How to control sctipt init and update order.
  Could `components` be entirely scraped? Like unity, component data could be in scripts.
  Would this be useful/easy/more convenient?
  */

  constructor(data) {
    super();
    this.eventTypes = [];
    this.events = [];
    this.isActive = true;
    this.tags = [];
    this.scripts = [];
  }

  init(rootEntity){
    this.children.forEach((child) => {
      if(child.init) child.init(rootEntity);
    });
    this.scripts.forEach((script) => {
      script.init(this, rootEntity);
    });
    EventMan.registerListener(this);
  }

  // TODO: Check if event is relevant to the script.
  handleEvents() {
    this.events.forEach((evt) => {
      this.scripts.forEach((script) => {
        script.handleGameEvent(this, evt);
      });
    });
    this.events = [];
  }

  // findEntityWithTags(tags){
  // }

  findEntitiesWithTag(tag){

    if(this.tags.indexOf(tag) >= 0){ return [this]; }
    else {
      let ents = [];
      for(let i = 0; i < this.children.length;i++){
        let child = this.children[i];
        let found = [];
        if(child.findEntitiesWithTag){
          found = child.findEntitiesWithTag(tag);
          found.forEach(e => {
            ents.push(e);
          });
          // log.debug(found.forEach);
        }
      }
      return ents;
    }
  }

  findEntityWithTag(tag){
    let indof = this.tags.indexOf(tag);
    if(indof >= 0){ return this; }
    else {
      for(let i = 0; i < this.children.length;i++){
        let child = this.children[i];
        let found;
        if(child.findEntityWithTag){
          found = child.findEntityWithTag(tag);
        }
        if(found){
          return found;
        }
      }
    }
  }

  // TODO: Remove duplicate event types (keep only topmost)
  addScript(scriptName, parameters) {
    let script = new Scripts[scriptName](parameters);
    this.scripts.push(script);
    let eventTypes = script.eventTypes;
    eventTypes.forEach((eventType) => {
      this.eventTypes.push(eventType);
    });
  }

  addEvent(evt) {
    this.events.push(evt);
  }

  setSprite(spriteName){
    if(!this.sprite){
      this.sprite = new PIXI.Sprite();
      this.sprite.anchor = {
        x: 0.5,
        y: 0.5
      };
      this.addChild(this.sprite);
      let opts = this.sprite_options || {
        scale:1,
        offset: {
          x:0,
          y:0
        }
      };
      this.sprite.scale.x = opts.scale;
      this.sprite.scale.y = opts.scale;
      this.sprite.position = opts.offset;

      if(this.debugGraphics){
        this.swapChildren(this.debugGraphics, this.sprite);
      }
    }
    this.sprite.texture = resources.sprite.textures[spriteName];
  }

  // https://github.com/wellcaffeinated/PhysicsJS/wiki/Fundamentals#the-factory-pattern
  addPhysics(bodyType, options = {}) {
    this.physics = {
      inWorld: false,
      body: Physics.body(bodyType, options)
    };
  }

  addDebugGraphics(){
    let physics = this.physics;
    if(physics){
      let body = physics.body;
      this.debugGraphics = new PIXI.Graphics();
      let color = this.collider_color || '0xFFFFFF';

      // log.debug(body);
      this.debugGraphics.beginFill(color);
      this.debugGraphics.lineStyle(2, '0x000000');
      this.debugGraphics.alpha = 0.5;
      this.debugGraphics.drawRect(0, 0, body.width, body.height);
      this.debugGraphics.pivot = {
        x: body.width/2,
        y: body.height/2
      };
      this.addChild(this.debugGraphics);
    }

  }
  /*
    Unpacks entity from configuration file. Loads config
    Config format:
      - component_data
        - Will go straight to entity.
          Useful when defining components that dont need their own config files
      - component_configuration
        - Holds a handle for config file that holds the actual data.
          Useful when actual component data is in another file. Like animations.
    Create entity with this and see its structure for more info.
  */
  static fromConfig(configName){
    return Entity.fromConfigObj(resources[configName].data);
  }

  static fromConfigObj(config){
    const ent = new Entity();

    // Assign component_data to entity
    Object.assign(ent, config.component_data);

    // Get each component_configuration and set them to entity
    const compConf = config.component_configuration;
    Object.keys(compConf).forEach(key => {
      ent[key] = resources[compConf[key]].data;
    });

    const physics = config.physics;
    if(physics){
      ent.addPhysics(physics.bodyType, physics.options);
      if(cfg.debugMode) ent.addDebugGraphics();
    }

    const scriptConf = config.scripts;
    scriptConf.forEach(conf => {
      const name = conf.name;
      const params = conf.parameters || {};
      ent.addScript(name, params);
    });
    return ent;
  }

  static fromTiledObject(tiledObj){
    let props = tiledObj.properties;
    let config = resources[props.config].data;

    Object.assign(config.component_data, tiledObj.properties);

    config.physics.options.x = tiledObj.x + tiledObj.width/2;
    config.physics.options.y = tiledObj.y + tiledObj.height/2;
    config.physics.options.width = tiledObj.width;
    config.physics.options.height = tiledObj.height;

    let ent = Entity.fromConfigObj(config);
    // log.debug(ent);
    return ent;
  }

}

export {Entity};
