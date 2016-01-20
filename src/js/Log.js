import cfg from 'res/config/config.json';

const levels = new Map([
    [1, 'DEBUG'],
    [2, 'INFO '],
    [3, 'WARN '],
    [4, 'ERROR'],
    [5, 'FATAL']
]);

function print(msg='', level=1, csstag="color: #22AA22;"){
    if(level >= cfg.logLevel){
        const tag = levels.get(level);
        console.log(`%c[${tag}]:`, csstag, msg);
    }
}

const log = {
    debug: (msg) => { print(msg, 1, "color: #22AA22;"); },
    info:  (msg) => { print(msg, 2, "color: #2222AA;"); },
    warn:  (msg) => { print(msg, 3, "color: #CC8822;"); },
    error: (msg) => { print(msg, 4, "color: #DD4422;"); },
    fatal: (msg) => { print(msg, 5, "color: #FF0000;"); },
    print: print,
    test: test
};

function test(){
    log.debug("debug msg");
    log.info("info msg");
    log.warn("warn msg");
    log.error("error msg");
    log.fatal("fatal msg");
    log.print(log);
}
export {log};
