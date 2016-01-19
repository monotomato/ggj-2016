import {Entity} from './Entity';
import config from './../res/config.json';

function mainfn () {
    console.log(config);
    
    let hero = new Entity(config.hero.first, config.hero.last);
    console.log(hero);

    let compliment = config.compliment;
    let message = `Hello ${hero.fullName}! You are ${compliment}!`;
    console.log(message);

    showoff();
}

function showoff (){
    let nums = Array.from(new Array(5), (x,i) => i);
    let sqr = nums.map(v => v * v);
    console.log(`squares: ${sqr}`);
}

mainfn();
