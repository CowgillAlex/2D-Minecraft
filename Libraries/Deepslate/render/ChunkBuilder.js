import { mat4, vec3 } from '../../gl-matrix/esm/index.js';
import { BlockPos, Direction, Vector } from '../index.js';
import { Mesh } from './Mesh.js';
import { SpecialRenderer, SpecialRenderers } from './SpecialRenderer.js';
export class ChunkBuilder {
    gl;
    structure;
    resources;
    chunks = [];
    chunkSize;
    constructor(gl, structure, resources, chunkSize = 16) {
        this.gl = gl;
        this.structure = structure;
        this.resources = resources;
        this.chunkSize = typeof chunkSize === 'number' ? [chunkSize, chunkSize, chunkSize] : chunkSize;
        this.updateStructureBuffers();
    }
    setStructure(structure) {
        this.structure = structure;
        this.updateStructureBuffers();
    }
    updateStructureBuffers(chunkPositions) {
        if (!this.structure)
            return;
        if (!chunkPositions) {
            this.chunks.forEach(x => x.forEach(y => y.forEach(chunk => {
                chunk.mesh.clear();
                chunk.transparentMesh.clear();
            })));
        }
        else {
            chunkPositions.forEach(chunkPos => {
                const chunk = this.getChunk(chunkPos);
                chunk.mesh.clear();
                chunk.transparentMesh.clear();
            });
        }
        for (const b of this.structure.getBlocks()) {
            const blockName = b.state.getName();
            const blockProps = b.state.getProperties();
            const defaultProps = this.resources.getDefaultBlockProperties(blockName) ?? {};
            Object.entries(defaultProps).forEach(([k, v]) => {
                if (!blockProps[k])
                    blockProps[k] = v;
            });
            const chunkPos = [Math.floor(b.pos[0] / this.chunkSize[0]), Math.floor(b.pos[1] / this.chunkSize[1]), Math.floor(b.pos[2] / this.chunkSize[2])];
            if (chunkPositions && !chunkPositions.some(pos => vec3.equals(pos, chunkPos)))
                continue;
            const chunk = this.getChunk(chunkPos);
            try {
                const blockDefinition = this.resources.getBlockDefinition(blockName);
                const cull = {
                    up: this.needsCull(b, Direction.UP),
                    down: this.needsCull(b, Direction.DOWN),
                    west: this.needsCull(b, Direction.WEST),
                    east: this.needsCull(b, Direction.EAST),
                    north: this.needsCull(b, Direction.NORTH),
                    south: this.needsCull(b, Direction.SOUTH),
                };
                const mesh = new Mesh();
                if (blockDefinition) {
                    mesh.merge(blockDefinition.getMesh(blockName, blockProps, this.resources, this.resources, cull));
                }
                if (SpecialRenderers.has(blockName.toString())) {
                    mesh.merge(SpecialRenderer[blockName.toString()](blockProps, this.resources, cull));
                }
                if (!mesh.isEmpty()) {
                    this.finishChunkMesh(mesh, b.pos);
                    if (this.resources.getBlockFlags(b.state.getName())?.semi_transparent) {
                        chunk.transparentMesh.merge(mesh);
                    }
                    else {
                        chunk.mesh.merge(mesh);
                    }
                }
            }
            catch (e) {
                console.error(`Error rendering block ${blockName}`, e);
            }
        }
        if (!chunkPositions) {
            this.chunks.forEach(x => x.forEach(y => y.forEach(chunk => {
                chunk.mesh.rebuild(this.gl, { pos: true, color: true, texture: true, normal: true, blockPos: true });
                chunk.transparentMesh.rebuild(this.gl, { pos: true, color: true, texture: true, normal: true, blockPos: true });
            })));
        }
        else {
            chunkPositions.forEach(chunkPos => {
                const chunk = this.getChunk(chunkPos);
                chunk.mesh.rebuild(this.gl, { pos: true, color: true, texture: true, normal: true, blockPos: true });
                chunk.transparentMesh.rebuild(this.gl, { pos: true, color: true, texture: true, normal: true, blockPos: true });
            });
        }
    }
    getMeshes() {
        const chunks = this.chunks.flatMap(x => x.flatMap(y => y.flatMap(chunk => chunk ?? [])));
        return chunks.flatMap(chunk => chunk.mesh.isEmpty() ? [] : chunk.mesh).concat(chunks.flatMap(chunk => chunk.transparentMesh.isEmpty() ? [] : chunk.transparentMesh));
    }
    needsCull(block, dir) {
        const neighbor = this.structure.getBlock(BlockPos.towards(block.pos, dir))?.state;
        if (!neighbor)
            return false;
        const neighborFlags = this.resources.getBlockFlags(neighbor.getName());
        if (block.state.getName().equals(neighbor.getName()) && neighborFlags?.self_culling) {
            return true;
        }
        if (neighborFlags?.opaque) {
            return !(dir === Direction.UP && block.state.isFluid());
        }
        else {
            return block.state.isFluid() && neighbor.isFluid();
        }
    }
    finishChunkMesh(mesh, pos) {
        const t = mat4.create();
        mat4.translate(t, t, pos);
        mesh.transform(t);
        for (const q of mesh.quads) {
            const normal = q.normal();
            q.forEach(v => v.normal = normal);
            q.forEach(v => v.blockPos = new Vector(pos[0], pos[1], pos[2]));
        }
    }
    getChunk(chunkPos) {
        const x = Math.abs(chunkPos[0]) * 2 + (chunkPos[0] < 0 ? 1 : 0);
        const y = Math.abs(chunkPos[1]) * 2 + (chunkPos[1] < 0 ? 1 : 0);
        const z = Math.abs(chunkPos[2]) * 2 + (chunkPos[2] < 0 ? 1 : 0);
        if (!this.chunks[x])
            this.chunks[x] = [];
        if (!this.chunks[x][y])
            this.chunks[x][y] = [];
        if (!this.chunks[x][y][z])
            this.chunks[x][y][z] = { mesh: new Mesh(), transparentMesh: new Mesh() };
        return this.chunks[x][y][z];
    }
}
//# sourceMappingURL=ChunkBuilder.js.map