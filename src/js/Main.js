import {Entity} from 'Entity';
import {Input} from 'Input';
import {log} from 'Log';
import {loadResources, resources} from 'Loader';

// NOTE: This compiles cfg file into the compiled main.js file at compile time.
import cfg from 'config.json';

// Times
const loopInterval = 1000 / cfg.fps;
let lastFrame = 0;

function main () {
    log.test();
    log.info(`Target loop interval: ${loopInterval}`);
    loadResources(initReady);
}

function initReady(){
    log.info("Initialization ready!");
    log.fatal(resources);
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

function draw () {

}

function inputDemo() {
    if(Input.keyPressed.down){ log.debug("Down just pressed!"); }
    if(Input.keyReleased.up){ log.debug("Up just released!"); }
    if(Input.keyDown.right){ log.debug("Right is down!"); }
}
main(); // Main entry
