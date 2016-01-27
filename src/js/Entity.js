import {resources} from 'Loader';
import {log} from 'Log';
import {Input} from 'Input';
import {Scripts} from 'Scripts/Scripts';

class Entity extends PIXI.Container {

  constructor(data) {
    super();
    this.eventTypes = [];
    this.events = [];
    this.isActive = true;
    this.scripts = [];
  }

  handleEvents() {
    this.events.forEach((evt) => {
      this.scripts.forEach((script) => {
        script.handleGameEvent(this, evt);
      });
    });
    this.events = [];
  }

  // TODO: remove duplicate event types (keep only topmost)
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
    const config = resources[configName].data;
    const ent = new Entity();

    // Assign component_data to entity
    Object.assign(ent, config.component_data);

    // Get each component_configuration and set them to entity
    const compConf = config.component_configuration;
    Object.keys(compConf).forEach(key => {
      ent[key] = resources[compConf[key]].data;
    });

    return ent;
  }
}

export {Entity};
