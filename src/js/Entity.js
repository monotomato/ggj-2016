import {resources} from 'Loader';
import {log} from 'Log';

class Entity extends PIXI.Container {

  constructor(data) {
      super();
  }

  setSprite(spriteName){
    if(!this.sprite){
      this.sprite = new PIXI.Sprite();
      this.addChild(this.sprite);
    }
    this.sprite.texture = resources.sprite.textures[spriteName];
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
