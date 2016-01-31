import {log} from 'Log';
import {Entity} from 'Entity';
import {EventMan} from 'Managers/EventManager';
import {resources} from 'Managers/ResourceManager';
import {wordWrap} from 'Utils/StringUtil';

class Factory {

  // static addSprite(ent, priteName, opts) {
  //   let sprite = new PIXI.Spite();
  //   ent.addChild(sprite);
  //   sprite.anchor = {
  //     x: 0.5,
  //     y: 0.5
  //   };
  //   sprite.scale.x = opts.scale;
  //   sprite.scale.y = opts.scale;
  //   sprite.position = opts.offset;
  // }

  static createSpeechBubble(width, height, arrowPos, text) {
    let box = new Entity();
    let addSprite = (spriteName, opts) => {
      let sprite = new PIXI.Sprite();
      box.addChild(sprite);
      sprite.anchor = {
        x: 0.5,
        y: 0.5
      };
      sprite.scale.x = opts.scale;
      sprite.scale.y = opts.scale;
      sprite.position = opts.offset;
      sprite.texture = resources.sprite.textures[spriteName];
    };

    let tileWidth = 32;
    let tileHeight = 32;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let t = 'sprite_piece_5';
        if (x === 0) {
          t = 'sprite_piece_4';
          if (y === 0) {
            t = 'sprite_piece_1';
          } else if (y === height - 1) {
            t = 'sprite_piece_7';
          }
        } else if (x === width - 1) {
          t = 'sprite_piece_6';
          if (y === 0) {
            t = 'sprite_piece_3';
          } else if (y === height - 1) {
            t = 'sprite_piece_9';
          }
        } else {
          if (y === 0) {
            t = 'sprite_piece_2';
          } else if (y === height - 1) {
            t = t = 'sprite_piece_8';
          }
        }
        addSprite(t, {
          scale: 0.25,
          offset: {
            x: tileWidth * x,
            y: tileHeight * y
          }
        });
      }
    }

    addSprite('sprite_piece_11', {
      scale: 0.25,
      offset: {
        x: tileWidth * arrowPos,
        y: tileHeight * height
      }
    });
    addSprite('sprite_piece_10', {
      scale: 0.25,
      offset: {
        x: tileWidth * arrowPos,
        y: tileHeight * (height - 1)
      }
    });

    let textObj = new PIXI.Text(wordWrap(text, 30), {font : '18px Monaco', fill : 0x121212, align : 'left'});
    box.addChild(textObj);

    box.position.x = -tileWidth * (arrowPos) - 4;
    box.position.y = -height * (tileHeight) - 16;

    let ent = new Entity();
    ent.addChild(box);
    return ent;
  }
}

export {Factory};