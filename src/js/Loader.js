import {log} from 'Log';
import rescfg from 'res/config/resources.json';
import cfg from 'res/config/config.json';

const resourcesMap = new Map( Object.keys(rescfg).map(key => {
        return [key, rescfg[key]];
    }));

const loader = PIXI.loader;
const resources = loader.resources;
const loadBarLen = 20;

function load() {
    log.info('Loading resources');
    loader.baseUrl = cfg.resBaseUrl;

    resourcesMap.forEach((value, key) => {
        loader.add(key, value);
    });

    loader.on('progress', loadProgress);

    const promise = new Promise((resolve, reject) =>{
        loader.once('complete',() =>{resolve("asd");});
        loader.load();
    });

    return promise;
    // loader.load();
}

function loadProgress(loader,res){
    let p = loader.progress;
    let ready = Math.floor(loadBarLen * (p / 100));
    let i = '='.repeat(ready) + ' '.repeat(loadBarLen - ready);
    let str = `Progress [${i}] ${p}%`;
    log.info(str);
}

function loaded() {
    log.info('Loading done!');
    log.info(resources);
}

export {load as loadResources, resources};
