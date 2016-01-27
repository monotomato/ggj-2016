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
    const promise = new Promise((resolve, reject) => {
      let soundConfig = resources.sounds.data;

      let ready = function(){
        resolve('Audio manager init done!');
      };
      // Paths are just filenames. This adds rest of the path
      let fixedUrls = soundConfig.urls.map((e) => 'res/sounds/' + e);
      this.howl = new Howl({
        src: fixedUrls,
        sprite: soundConfig.sprite,
        // html5: true,
        preload: true,
        onload: ready
      });
    });

    return promise;
  }

  handleSingleEvent(evt) {
    let spriteName = evt.parameters.audio;

    this.howl.play(spriteName);
  }

}
const AudioMan = new AudioManager();

export {AudioMan};
