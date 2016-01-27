import {resources} from 'Managers/ResourceManager';

class UIFrame extends Container {
  constructor(
      width, height,
      image = "",
      colour = "0xFF00FF",
      borderWidth = 0,
      borderColor = "0x000000") {

    let graphics = new PIXI.Graphics();
    graphics.beginFill(colour);
    graphics.lineStyle(borderWidth, borderColor);
    graphics.drawRect(0, 0, width, height);
    this.addChild(graphics);

    if (image !== "") {
      let sprite = new PIXI.Sprite();
      sprite.texture = resources.sprite.textures[image];
      this.addChild(sprite);
    }
  }
}

export {UIFrame};
