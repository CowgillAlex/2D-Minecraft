import { vec3 } from '../../gl-matrix/esm/index.js';
import { Vector } from '../math/index.js';
export class Vertex {
    pos;
    color;
    texture;
    normal;
    blockPos;
    static VEC = vec3.create();
    constructor(pos, color, texture, normal, blockPos) {
        this.pos = pos;
        this.color = color;
        this.texture = texture;
        this.normal = normal;
        this.blockPos = blockPos;
    }
    transform(transformation) {
        Vertex.VEC[0] = this.pos.x;
        Vertex.VEC[1] = this.pos.y;
        Vertex.VEC[2] = this.pos.z;
        vec3.transformMat4(Vertex.VEC, Vertex.VEC, transformation);
        this.pos = new Vector(Vertex.VEC[0], Vertex.VEC[1], Vertex.VEC[2]);
        return this;
    }
    static fromPos(pos) {
        return new Vertex(pos, [0, 0, 0], [0, 0], undefined, undefined);
    }
}
//# sourceMappingURL=Vertex.js.map