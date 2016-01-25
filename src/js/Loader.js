import {log} from 'Log';
import cfg from 'config.json';

const loader = PIXI.loader;
const resources = loader.resources;
const loadBarLen = 10;
let callback;

function load(_callback) {
  callback = _callback;
  let filelistLoader = new PIXI.loaders.Loader(); // you can also create your own if you want

  Object.keys(cfg.resourceLists).forEach(key => {
    filelistLoader.add(cfg.resourceLists[key]);
  });

  filelistLoader.on('progress', (a,b) => loadProgress(a,b,'Filelist'));
  filelistLoader.once('complete',loadRes);
  filelistLoader.load();
}

function loadRes(ldr, res){
  log.debug(res);

  Object.keys(res).forEach(key => {
    res[key].data.forEach(path => {
      loader.add(getName(path), path);
    });
  });

  cfg.staticResources.forEach( path => {
    loader.add(getName(path), path);
  });

  loader.on('progress', (a,b) => loadProgress(a,b,'Resource'));
  loader.once('complete', loaded);
  loader.load();
}

function loadProgress(ldr, res, header){
  let p = ldr.progress;
  let ready = Math.floor(loadBarLen * (Math.floor(p) / 100));
  let i = '='.repeat(ready) + ' '.repeat(loadBarLen - ready);
  let str = `${header} progress [${i}] ${Math.floor(p)}%`;
  log.info(str);
}

function getName(path){
  return path.split('\\').pop().split('/').pop().split('.')[0];
}

function loaded(ldr, res) {
  callback();
}

export {load as loadResources, resources};
