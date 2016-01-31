import {log} from 'Log';
import {resources} from 'Managers/ResourceManager';
import cfg from 'config.json';
import {Manager} from 'Manager';

class AudioManager extends Manager {
  constructor() {
    super();
    this.eventTypes = ['audio'];
    this.musicid = -1;
    this.soundid = -1;
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

    if(evt.eventType == 'audio_sound_play'){
      if(this.soundid >= 0 ){
        this.howl.stop(this.soundid);
      }
      this.soundid = this.howl.play(spriteName);
    }
    else if(evt.eventType == 'audio_music_play'){
      if(this.musicid >= 0 ){
        this.howl.stop(this.musicid);
      }
      this.musicid = this.howl.play(spriteName);
    }

  }

}
const AudioMan = new AudioManager();

export {AudioMan};
