import cfg from 'config.json';

const levels = new Map([
    [1, ['DEBUG', 'color: #22AA22;']],
    [2, ['INFO ', 'color: #2222AA;']],
    [3, ['WARN ', 'color: #CC8822;']],
    [4, ['ERROR', 'color: #DD4422;']],
    [5, ['FATAL', 'color: #FF0000;']]
]);

function print(msg='', level=1){
    level = Math.max(1, Math.min(5, level));
    if(level >= cfg.logLevel){
        const prop = levels.get(level);
        console.log(`%c[${prop[0]}]:`, prop[1], msg);
    }
}

const log = {
    debug: (msg) => { print(msg, 1); },
    info:  (msg) => { print(msg, 2); },
    warn:  (msg) => { print(msg, 3); },
    error: (msg) => { print(msg, 4); },
    fatal: (msg) => { print(msg, 5); },
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
