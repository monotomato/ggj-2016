import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';
import {resources} from 'Managers/ResourceManager';
import {rand} from 'Utils/NumUtil';

class VillagerAnimationScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'animation_test'
    );
    let allparts = this.getVillagerParts();
    // console.log(this);
    let partnames = Object.keys(this.parts);
    this.parts.body = allparts.body[rand(allparts.body.length)];
    this.parts.head = allparts.head[rand(allparts.head.length)];
    this.parts.hair = allparts.hair[rand(allparts.hair.length)];
    this.parts.limbs = allparts.limbs[rand(allparts.limbs.length)];
    // this.parts.
    this.timeAtCurrentFrame = -1;
    this.duration = 60;
    this.currentFrame = 0;
  }

  init(parent, rootEntity) {
    // console.log(this.parts);
    let sprites = {};
    sprites.head = new PIXI.Sprite();
    sprites.body = new PIXI.Sprite();
    sprites.limbs = new PIXI.Sprite();
    sprites.hair = new PIXI.Sprite();
    sprites.head.texture = resources.sprite.textures['sprite_npc_head_' + this.parts.head + '_0'];
    sprites.body.texture = resources.sprite.textures['sprite_npc_body_' + this.parts.body + '_0'];
    sprites.limbs.texture = resources.sprite.textures['sprite_npc_limbs_' + this.parts.limbs + '_0'];
    sprites.hair.texture = resources.sprite.textures['sprite_npc_hair_' + this.parts.hair + '_0'];
    this.sprites = sprites;
    Object.keys(sprites).forEach(key => {
      sprites[key].anchor = {
            x: 0.5,
            y: 0.5
          };

    });
    parent.addChild(sprites.limbs);
    parent.addChild(sprites.body);
    parent.addChild(sprites.head);
    parent.addChild(sprites.hair);
  }

  update(parent, rootEntity, delta) {
    if(this.timeAtCurrentFrame > this.duration || this.timeAtCurrentFrame === -1){
      const newFrame = (this.currentFrame + 1) % 2;
      this.sprites.head.texture = resources.sprite.textures['sprite_npc_head_' + this.parts.head + '_' + newFrame];
      this.sprites.body.texture = resources.sprite.textures['sprite_npc_body_' + this.parts.body + '_'+ newFrame];
      this.sprites.limbs.texture = resources.sprite.textures['sprite_npc_limbs_' + this.parts.limbs + '_'+ newFrame];
      this.sprites.hair.texture = resources.sprite.textures['sprite_npc_hair_' + this.parts.hair + '_'+ newFrame];
      this.currentFrame = newFrame;
      this.timeAtCurrentFrame = 0;
    } else {
      this.timeAtCurrentFrame += delta;
    }
  }

  handleGameEvent(parent, evt) {
    // log.debug('Anim script: ' + evt.parameters.message);
  }

  getVillagerParts(){
    let parts = {
      head: [],
      body: [],
      hair: [],
      limbs: []
    };
    Object.keys(resources.sprite.textures).forEach( key => {
      let splitted = key.split('_');
      if (splitted[0] === 'sprite' && splitted[1] === 'npc') {
        if(parts[splitted[2]].indexOf(splitted[3]) < 0){
          parts[splitted[2]].push(splitted[3]);
        }
      }
    });
    return parts;
  }
}


export {VillagerAnimationScript};
