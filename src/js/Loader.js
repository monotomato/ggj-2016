import {log} from 'Log';
import cfg from 'config.json';

const loader = PIXI.loader;
const resources = loader.resources;
const loadBarLen = 20;
let callback;

function load(_callback) {
  callback = _callback;
  log.info("Loading filelists");
  let filelistLoader = new PIXI.loaders.Loader(); // you can also create your own if you want

  Object.keys(cfg.resourceLists).forEach(key => {
    filelistLoader.add(cfg.resourceLists[key]);
  });

  filelistLoader.on('progress', loadProgress);
  filelistLoader.once('complete',loadRes);
  filelistLoader.load();
}

function loadRes(ldr, res){
  log.info('Filelists loaded');
  log.info("Loading resources");
  log.debug(res);

  Object.keys(res).forEach(key => {
    res[key].data.forEach(path => {
      loader.add(getName(path), path);
    });
  });

  cfg.staticResources.forEach( path => {
    loader.add(getName(path), path);
  });

  loader.on('progress', loadProgress);
  loader.once('complete', loaded);
  loader.load();
}

function loadProgress(ldr,res){
    let p = ldr.progress;
    let ready = Math.floor(loadBarLen * (p / 100));
    let i = '='.repeat(ready) + ' '.repeat(loadBarLen - ready);
    let str = `Progress [${i}] ${p}%`;
    log.info(str);
}

function getName(path){
  return path.split('\\').pop().split('/').pop().split('.')[0];
}

function loaded(ldr, res) {
    log.info('Loading done!');
    callback();
}

export {load as loadResources, resources};
