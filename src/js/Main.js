import {Entity} from './Entity';
import {Input} from './Input';
import {log} from './Log';
// NOTE: This compiles cfg file into the compiled main.js file at compile time.
import cfg from './../res/config/config.json';

// Time
const loopInterval = 1000 / cfg.fps;
let lastFrame = 0;

function main () {
    log.test();

    console.log(`Target loop interval: ${loopInterval}`);
    requestAnimationFrame(loop);
}

function loop (ctime) {
    const delta = ctime - lastFrame;

    if(ctime - lastFrame > loopInterval) {
        lastFrame = ctime;
        update();
        draw();
        Input.update();
    }
    requestAnimationFrame(loop);
}

function update () {
    inputDemo();
}

function inputDemo() {
    if(Input.keyPressed.down){ console.log("Down just pressed!"); }
    if(Input.keyReleased.up){ console.log("Up just released!"); }
    if(Input.keyDown.right){ console.log("Right is down!"); }
}

function draw () {

}

main(); // Main entry
