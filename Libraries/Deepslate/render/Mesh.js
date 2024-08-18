import { Vector } from '../index.js';
import { Line } from './Line.js';
import { Vertex } from './Vertex.js';
export class Mesh {
    quads;
    lines;
    posBuffer;
    colorBuffer;
    textureBuffer;
    normalBuffer;
    blockPosBuffer;
    indexBuffer;
    linePosBuffer;
    lineColorBuffer;
    constructor(quads = [], lines = []) {
        this.quads = quads;
        this.lines = lines;
    }
    clear() {
        this.quads = [];
        this.lines = [];
        return this;
    }
    isEmpty() {
        return this.quads.length === 0 && this.lines.length === 0;
    }
    quadVertices() {
        return this.quads.length * 4;
    }
    quadIndices() {
        return this.quads.length * 6;
    }
    lineVertices() {
        return this.lines.length * 2;
    }
    merge(other) {
        this.quads = this.quads.concat(other.quads);
        this.lines = this.lines.concat(other.lines);
        return this;
    }
    addLine(x1, y1, z1, x2, y2, z2, color) {
        const line = new Line(Vertex.fromPos(new Vector(x1, y1, z1)), Vertex.fromPos(new Vector(x2, y2, z2))).setColor(color);
        this.lines.push(line);
        return this;
    }
    addLineCube(x1, y1, z1, x2, y2, z2, color) {
        this.addLine(x1, y1, z1, x1, y1, z2, color);
        this.addLine(x2, y1, z1, x2, y1, z2, color);
        this.addLine(x1, y1, z1, x2, y1, z1, color);
        this.addLine(x1, y1, z2, x2, y1, z2, color);
        this.addLine(x1, y1, z1, x1, y2, z1, color);
        this.addLine(x2, y1, z1, x2, y2, z1, color);
        this.addLine(x1, y1, z2, x1, y2, z2, color);
        this.addLine(x2, y1, z2, x2, y2, z2, color);
        this.addLine(x1, y2, z1, x1, y2, z2, color);
        this.addLine(x2, y2, z1, x2, y2, z2, color);
        this.addLine(x1, y2, z1, x2, y2, z1, color);
        this.addLine(x1, y2, z2, x2, y2, z2, color);
        return this;
    }
    transform(transformation) {
        for (const quad of this.quads) {
            quad.transform(transformation);
        }
        return this;
    }
    rebuild(gl, options) {
        const rebuildBuffer = (buffer, type, data) => {
            if (!buffer) {
                buffer = gl.createBuffer() ?? undefined;
            }
            if (!buffer) {
                throw new Error('Cannot create new buffer');
            }
            gl.bindBuffer(type, buffer);
            gl.bufferData(type, data, gl.DYNAMIC_DRAW);
            return buffer;
        };
        const rebuildBufferV = (array, buffer, mapper) => {
            if (array.length === 0) {
                if (buffer)
                    gl.deleteBuffer(buffer);
                return undefined;
            }
            const data = array.flatMap(e => e.vertices().flatMap(v => {
                const data = mapper(v);
                if (!data)
                    throw new Error('Missing vertex component');
                return data;
            }));
            return rebuildBuffer(buffer, gl.ARRAY_BUFFER, new Float32Array(data));
        };
        if (options.pos) {
            this.posBuffer = rebuildBufferV(this.quads, this.posBuffer, v => v.pos.components());
            this.linePosBuffer = rebuildBufferV(this.lines, this.linePosBuffer, v => v.pos.components());
        }
        if (options.color) {
            this.colorBuffer = rebuildBufferV(this.quads, this.colorBuffer, v => v.color);
            this.lineColorBuffer = rebuildBufferV(this.lines, this.lineColorBuffer, v => v.color);
        }
        if (options.texture) {
            this.textureBuffer = rebuildBufferV(this.quads, this.textureBuffer, v => v.texture);
        }
        if (options.normal) {
            this.normalBuffer = rebuildBufferV(this.quads, this.normalBuffer, v => v.normal?.components());
        }
        if (options.blockPos) {
            this.blockPosBuffer = rebuildBufferV(this.quads, this.blockPosBuffer, v => v.blockPos?.components());
        }
        if (this.quads.length === 0) {
            if (this.indexBuffer)
                gl.deleteBuffer(this.indexBuffer);
            this.indexBuffer = undefined;
        }
        else {
            this.indexBuffer = rebuildBuffer(this.indexBuffer, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.quads.flatMap((_, i) => [4 * i, 4 * i + 1, 4 * i + 2, i * 4, 4 * i + 2, 4 * i + 3], true)));
        }
        return this;
    }
}
//# sourceMappingURL=Mesh.js.map