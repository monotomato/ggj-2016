import keycfg from './../res/config/keys.json';

var keys = new Map( Object.keys(keycfg).map(key => {
        return [keycfg[key], key];
    }));

var Input = {
    keyDown: {},        // Is key down
    keyPressed: {},     // Is key just pressed. True for one frame.
    keyReleased: {},    // Is key just released. True for one frame.
    update: function () {
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
