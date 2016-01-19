class Entity extends PIXI.Container {
    constructor(firstName, lastName) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
export {Entity};
