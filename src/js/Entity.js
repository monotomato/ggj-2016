class Entity extends PIXI.Container {
    constructor(data) {
        super();
        Object.assign(this, data); // NOTE: Could be super useful...
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    static staticFunction(){
        return "This is a static function";
    }
}
export {Entity};
