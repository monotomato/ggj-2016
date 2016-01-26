import keycfg from 'keys.json';

// TODO: Ensure input stays constant throughout game update. Keydown and keyup
// events will trigger even when game is updating.

const keys = new Map( Object.keys(keycfg).map(key => {
    return [keycfg[key], key];
  }));

const Input = {
  keyDown: {},        // Is key down
  keyPressed: {},     // Is key just pressed. True for one frame.
  keyReleased: {},    // Is key just released. True for one frame.
  update: function () { // Resets keyPressed and keyReleased values.
    this.keyPressed = {};
    this.keyReleased = {};
  }
};

function setKeyState(ev, state) {
  const code = ev.which;
  const key = keys.get(code);
  if( Input.keyDown[key] != state ) {
    Input.keyDown[key] = state;
    if(state){
      Input.keyPressed[key] = true;
    } else {
      Input.keyReleased[key] = true;
    }
    // console.log(`Changed key state to ${state} ${ev.which}`);
  }
}
export {Input};

window.addEventListener("keydown", (e) => setKeyState(e, true), false);
window.addEventListener("keyup", (e) => setKeyState(e, false), false);
