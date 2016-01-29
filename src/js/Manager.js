
class Manager {
  constructor(){
    this.eventTypes = [];
    this.events = [];
  }

  // Run at game init. Returns promise!
  init(){
    const promise = new Promise((resolve, reject) =>{
      resolve('Default manager init done!');
    });

    return promise;
  }

  // Run each frame.
  update(){
    this.handleEvents();
  }

  addEvent(evt) {
    this.events.push(evt);
  }

  handleEvents() {
    this.events.forEach((evt) => {
      this.handleSingleEvent(evt);
    });
    this.events = [];
  }

  handleSingleEvent(evt) {}

}
export{Manager};
