import keycfg from 'keys.json';
import {Manager} from 'Manager';

class InputManager extends Manager {
  constructor(){
    super();
    this.keyDown = {};
    this.keyPressed = {};
    this.keyReleased = {};
  }

  init(){
    const promise = new Promise((resolve, reject) => {

      this.keys = new Map( Object.keys(keycfg).map(key => {
          return [keycfg[key], key];
        }));

      window.addEventListener('keydown', (e) => this.setKeyState(e, true), false);
      window.addEventListener('keyup', (e) => this.setKeyState(e, false), false);

      resolve('Input manager init done!');

    });

    return promise;
  }

  setKeyState(ev, state) {
    const code = ev.which;
    const key = this.keys.get(code);
    if(key) ev.preventDefault();
    if( this.keyDown[key] != state ) {
      this.keyDown[key] = state;
      if(state){
        this.keyPressed[key] = true;
      } else {
        this.keyReleased[key] = true;
      }
    }
  }

  update(){
    /*TODO: Ensure input stays constant throughout game update.
    Keydown and keyup events will trigger even when game is updating.*/
    this.keyPressed = {};
    this.keyReleased = {};
  }

}

const InputMan = new InputManager();

export {InputMan};
