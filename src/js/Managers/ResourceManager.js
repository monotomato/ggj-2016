import {log} from 'Log';
import cfg from 'config.json';
import {Manager} from 'Manager';

class ResourceManager extends Manager {

  constructor(){
    super();
    this.loadBarLen = 10;
    this.loader = PIXI.loader;
    this.resources = this.loader.resources;
  }

  init(){
    const promise = new Promise((resolve, reject) => {
      const ready = () => {
        resolve('Resource manager init done!');
      };

      const error = (a,b,c) => {
        log.error(a);
        log.error(b);
        log.error(c);
        reject('Resource manager init ERROR!');
      };
      const filelistLoader = new PIXI.loaders.Loader();

      Object.keys(cfg.resourceLists).forEach(key => {
        filelistLoader.add(cfg.resourceLists[key]);
      });

      filelistLoader.on('progress', (a,b) => this.loadProgress(a,b,'Filelist'));
      filelistLoader.on('error', error);

      filelistLoader.once('complete', (ldr, res) => {

        Object.keys(res).forEach(key => {
          res[key].data.forEach(path => {
            this.loader.add(this.getName(path), path);
          });
        });

        cfg.staticResources.forEach( path => {
          this.loader.add(this.getName(path), path);
        });

        this.loader.on('progress', (a,b) => this.loadProgress(a,b,'Resource'));
        this.loader.on('error', error);
        this.loader.once('complete', ready);
        this.loader.load();
      });
      filelistLoader.load();
    });

    return promise;

  }

  getName(path){
    return path.split('\\').pop().split('/').pop().split('.')[0];
  }

  loadProgress(ldr, res, header){
    let p = ldr.progress;
    let ready = Math.floor(this.loadBarLen * (Math.floor(p) / 100));
    let i = '='.repeat(ready) + ' '.repeat(this.loadBarLen - ready);
    let str = `${header} progress [${i}] ${Math.floor(p)}%`;
    log.info(str);
  }

}

const ResourceMan = new ResourceManager();
const res = ResourceMan.resources;

export {ResourceMan, res as resources};
