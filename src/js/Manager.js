
class Manager {
  constructor(){

  }

  // Run at game init. Returns promise!
  init(){
    const promise = new Promise((resolve, reject) =>{
      resolve("Default manager init done!");
    });

    return promise;
  }

  // Run each frame.
  update(){

  }

}
export{Manager};
