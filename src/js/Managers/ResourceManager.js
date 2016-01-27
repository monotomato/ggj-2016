import {log} from 'Log';
import cfg from 'config.json';
import {Manager} from "Manager";

class ResourceManager extends Manager {

  constructor(){
    super();
    this.loadBarLen = 10;
    this.loader = PIXI.loader;
    this.resources = loader.resources;
  }

  init(){
    // TODO: Load resources

    const promise = new Promise((resolve, reject) => {
      const ready = () => {
        resolve("Resource manager init done!");
      };

      const error = () => {
        reject("Resource manager init ERROR!");
      };
      const filelistLoader = new PIXI.loaders.Loader();

      Object.keys(cfg.resourceLists).forEach(key => {
        filelistLoader.add(cfg.resourceLists[key]);
      });

      filelistLoader.on('progress', (a,b) => this.loadProgress(a,b,'Filelist'));
      filelistLoader.on('error', error);
      filelistLoader.once('complete', (ldr, res) => {
        log.debug(res);

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
    let ready = Math.floor(loadBarLen * (Math.floor(p) / 100));
    let i = '='.repeat(ready) + ' '.repeat(loadBarLen - ready);
    let str = `${header} progress [${i}] ${Math.floor(p)}%`;
    log.info(str);
  }

}

const loader = PIXI.loader;
const resources = loader.resources;
const loadBarLen = 10;
let callback;
//
// function load(_callback) {
//   callback = _callback;
//   let filelistLoader = new PIXI.loaders.Loader(); // you can also create your own if you want
//
//   Object.keys(cfg.resourceLists).forEach(key => {
//     filelistLoader.add(cfg.resourceLists[key]);
//   });
//
//   filelistLoader.on('progress', (a,b) => loadProgress(a,b,'Filelist'));
//   filelistLoader.once('complete',loadRes);
//   filelistLoader.load();
// }
//
// function loadRes(ldr, res){
//   log.debug(res);
//
//   Object.keys(res).forEach(key => {
//     res[key].data.forEach(path => {
//       loader.add(getName(path), path);
//     });
//   });
//
//   cfg.staticResources.forEach( path => {
//     loader.add(getName(path), path);
//   });
//
//   loader.on('progress', (a,b) => loadProgress(a,b,'Resource'));
//   loader.once('complete', loaded);
//   loader.load();
// }
//
// function loadProgress(ldr, res, header){
//   let p = ldr.progress;
//   let ready = Math.floor(loadBarLen * (Math.floor(p) / 100));
//   let i = '='.repeat(ready) + ' '.repeat(loadBarLen - ready);
//   let str = `${header} progress [${i}] ${Math.floor(p)}%`;
//   log.info(str);
// }

const ResourceMan = new ResourceManager();
const res = ResourceMan.resources;

export {ResourceMan, res as resources};
