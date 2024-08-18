import { Vertex } from './Vertex.js';
export class Quad {
    v1;
    v2;
    v3;
    v4;
    constructor(v1, v2, v3, v4) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.v4 = v4;
    }
    vertices() {
        return [this.v1, this.v2, this.v3, this.v4];
    }
    forEach(fn) {
        fn(this.v1);
        fn(this.v2);
        fn(this.v3);
        fn(this.v4);
        return this;
    }
    transform(transformation) {
        this.forEach(v => v.transform(transformation));
        return this;
    }
    normal() {
        const e1 = this.v2.pos.sub(this.v1.pos);
        const e2 = this.v3.pos.sub(this.v1.pos);
        return e1.cross(e2).normalize();
    }
    reverse() {
        [this.v1, this.v2, this.v3, this.v4] = [this.v4, this.v3, this.v2, this.v1];
        return this;
    }
    setColor(color) {
        this.forEach(v => v.color = color);
        return this;
    }
    setTexture(texture) {
        this.v1.texture = [texture[0], texture[1]];
        this.v2.texture = [texture[2], texture[3]];
        this.v3.texture = [texture[4], texture[5]];
        this.v4.texture = [texture[6], texture[7]];
        return this;
    }
    toString() {
        return `Quad(${this.v1.pos.toString()}, ${this.v2.pos.toString()}, ${this.v3.pos.toString()}, ${this.v4.pos.toString()})`;
    }
    static fromPoints(p1, p2, p3, p4) {
        return new Quad(Vertex.fromPos(p1), Vertex.fromPos(p2), Vertex.fromPos(p3), Vertex.fromPos(p4));
    }
}
//# sourceMappingURL=Quad.js.map