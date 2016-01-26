import {log} from "Log";

class EventManagerClass {
  constructor() {
    this.listeners = {
      listeners: []
    };
    this.events = [];
  }

  registerListener(listener) {
    listener.eventTypes.forEach((eventType) => {
      let s = eventType.split('_');
      let root = this.listeners;
      for (let i = 0; i < s.length; i++) {
        let key = s[i];
        if (!root[key]) {
          root[key] = {
            listeners: []
          };
        }
        root = root[key];
      }
      root.listeners.push(listener);
    });
  }

  publish(event) {
    this.events.push(event);
  }

  delegateEvents() {
    this.events.forEach((event) => {
      let eventType = event.eventType;
      let s = eventType.split('_');
      let root = this.listeners;
      root.listeners.forEach((listener) => listener.addEvent(event));
      for (let i = 0; i < s.length; i++) {
        let key = s[i];
        if (!root[key]) {
          break;
        }
        root = root[key];
        root.listeners.forEach((listener) => listener.addEvent(event));
      }
    });
    this.events = [];
  }

  // TODO: Implement removeListener in EventManager
  removeListener() {
    throw new Error('Remove Listener not implemented!');
  }
}

const EventManager = new EventManagerClass();

export {EventManager};
