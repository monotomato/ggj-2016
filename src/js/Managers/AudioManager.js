import {log} from 'Log';
import {resources} from 'Managers/ResourceManager';
import cfg from 'config.json';
import {Manager} from 'Manager';

class AudioManager extends Manager {
  constructor() {
    super();
    this.eventTypes = ['audio'];
  }

  init() {
    //TODO: Load audio files

    const promise = new Promise((resolve, reject) => {
      // this.howl = new Howl();
      resolve("Audio manager init done!");
    });

    return promise;
  }

  update() {
    //TODO: Do audio stuff
  }

  handleEvents() {

  }

  addEvents() {

  }

}
const AudioMan = new AudioManager();

export {AudioMan};
