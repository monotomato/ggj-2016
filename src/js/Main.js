import {Entity} from './Entity';

function mainfn () {
    let hero = new Entity("Super", "Hero");
    let compliment = "awesome";
    let message = `Hello ${hero.fullName}! You are ${compliment}!`;
    console.log(message);
    console.log(hero);
    showoff();
}

function showoff (){
    let nums = Array.from(new Array(5), (x,i) => i);
    let sqr = nums.map(v => v * v);
    console.log(`squares: ${sqr}`);
}

mainfn();
