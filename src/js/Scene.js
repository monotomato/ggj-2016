import {log} from 'Log';

class Scene extends PIXI.Container {

  constructor(data) {
    super();
  }

  update(delta, input){
    if(input.keyPressed.left){ log.debug(this);}
  }

}

export {Scene};
