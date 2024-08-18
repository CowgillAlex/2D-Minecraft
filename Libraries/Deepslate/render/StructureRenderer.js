import { mat4 } from '../../gl-matrix/esm/index.js';
import { BlockState } from '../core/index.js';
import { ChunkBuilder } from './ChunkBuilder.js';
import { Mesh } from './Mesh.js';
import { Renderer } from './Renderer.js';
import { ShaderProgram } from './ShaderProgram.js';
const vsColor = `
  attribute vec4 vertPos;
  attribute vec3 blockPos;

  uniform mat4 mView;
  uniform mat4 mProj;

  varying highp vec3 vColor;

  void main(void) {
    gl_Position = mProj * mView * vertPos;
    vColor = blockPos / 256.0;
  }
`;
const fsColor = `
  precision highp float;
  varying highp vec3 vColor;

  void main(void) {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;
const vsGrid = `
  attribute vec4 vertPos;
  attribute vec3 vertColor;

  uniform mat4 mView;
  uniform mat4 mProj;

  varying highp vec3 vColor;

  void main(void) {
    gl_Position = mProj * mView * vertPos;
    vColor = vertColor;
  }
`;
const fsGrid = `
  precision highp float;
  varying highp vec3 vColor;

  void main(void) {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;
export class StructureRenderer extends Renderer {
    structure;
    resources;
    gridShaderProgram;
    colorShaderProgram;
    gridMesh = new Mesh();
    outlineMesh = new Mesh();
    invisibleBlocksMesh = new Mesh();
    atlasTexture;
    useInvisibleBlocks;
    chunkBuilder;
    constructor(gl, structure, resources, options) {
        super(gl);
        this.structure = structure;
        this.resources = resources;
        const chunkSize = options?.chunkSize ?? 16;
        this.chunkBuilder = new ChunkBuilder(gl, structure, resources, chunkSize);
        if (options?.facesPerBuffer) {
            console.warn('[deepslate renderer warning]: facesPerBuffer option has been removed in favor of chunkSize');
        }
        this.useInvisibleBlocks = options?.useInvisibleBlockBuffer ?? true;
        this.gridShaderProgram = new ShaderProgram(gl, vsGrid, fsGrid).getProgram();
        this.colorShaderProgram = new ShaderProgram(gl, vsColor, fsColor).getProgram();
        this.gridMesh = this.getGridMesh();
        this.outlineMesh = this.getOutlineMesh();
        this.invisibleBlocksMesh = this.getInvisibleBlocksMesh();
        this.atlasTexture = this.createAtlasTexture(this.resources.getTextureAtlas());
    }
    setStructure(structure) {
        this.structure = structure;
        this.chunkBuilder.setStructure(structure);
        this.gridMesh = this.getGridMesh();
        this.invisibleBlocksMesh = this.getInvisibleBlocksMesh();
    }
    updateStructureBuffers(chunkPositions) {
        this.chunkBuilder.updateStructureBuffers(chunkPositions);
    }
    getGridMesh() {
        const [X, Y, Z] = this.structure.getSize();
        const mesh = new Mesh();
        mesh.addLine(0, 0, 0, X, 0, 0, [1, 0, 0]);
        mesh.addLine(0, 0, 0, 0, 0, Z, [0, 0, 1]);
        const c = [0.8, 0.8, 0.8];
        mesh.addLine(0, 0, 0, 0, Y, 0, c);
        mesh.addLine(X, 0, 0, X, Y, 0, c);
        mesh.addLine(0, 0, Z, 0, Y, Z, c);
        mesh.addLine(X, 0, Z, X, Y, Z, c);
        mesh.addLine(0, Y, 0, 0, Y, Z, c);
        mesh.addLine(X, Y, 0, X, Y, Z, c);
        mesh.addLine(0, Y, 0, X, Y, 0, c);
        mesh.addLine(0, Y, Z, X, Y, Z, c);
        for (let x = 1; x <= X; x += 1)
            mesh.addLine(x, 0, 0, x, 0, Z, c);
        for (let z = 1; z <= Z; z += 1)
            mesh.addLine(0, 0, z, X, 0, z, c);
        return mesh.rebuild(this.gl, { pos: true, color: true });
    }
    getOutlineMesh() {
        return new Mesh()
            .addLineCube(0, 0, 0, 1, 1, 1, [1, 1, 1])
            .rebuild(this.gl, { pos: true, color: true });
    }
    getInvisibleBlocksMesh() {
        const mesh = new Mesh();
        if (!this.useInvisibleBlocks) {
            return mesh;
        }
        const size = this.structure.getSize();
        for (let x = 0; x < size[0]; x += 1) {
            for (let y = 0; y < size[1]; y += 1) {
                for (let z = 0; z < size[2]; z += 1) {
                    const block = this.structure.getBlock([x, y, z]);
                    if (block === undefined)
                        continue;
                    if (block === null) {
                        mesh.addLineCube(x + 0.4375, y + 0.4375, z + 0.4375, x + 0.5625, y + 0.5625, z + 0.5625, [1, 0.25, 0.25]);
                    }
                    else if (block.state.is(BlockState.AIR)) {
                        mesh.addLineCube(x + 0.375, y + 0.375, z + 0.375, x + 0.625, y + 0.625, z + 0.625, [0.5, 0.5, 1]);
                    }
                    else if (block.state.is(new BlockState('cave_air'))) {
                        mesh.addLineCube(x + 0.375, y + 0.375, z + 0.375, x + 0.625, y + 0.625, z + 0.625, [0.5, 1, 0.5]);
                    }
                }
            }
        }
        return mesh.rebuild(this.gl, { pos: true, color: true });
    }
    drawGrid(viewMatrix) {
        this.setShader(this.gridShaderProgram);
        this.prepareDraw(viewMatrix);
        this.drawMesh(this.gridMesh, { pos: true, color: true });
    }
    drawInvisibleBlocks(viewMatrix) {
        if (!this.useInvisibleBlocks) {
            return;
        }
        this.setShader(this.gridShaderProgram);
        this.prepareDraw(viewMatrix);
        this.drawMesh(this.invisibleBlocksMesh, { pos: true, color: true });
    }
    drawStructure(viewMatrix) {
        this.setShader(this.shaderProgram);
        this.setTexture(this.atlasTexture);
        this.prepareDraw(viewMatrix);
        this.chunkBuilder.getMeshes().forEach(mesh => {
            this.drawMesh(mesh, { pos: true, color: true, texture: true, normal: true });
        });
    }
    drawColoredStructure(viewMatrix) {
        this.setShader(this.colorShaderProgram);
        this.prepareDraw(viewMatrix);
        this.chunkBuilder.getMeshes().forEach(mesh => {
            this.drawMesh(mesh, { pos: true, color: true, normal: true, blockPos: true });
        });
    }
    drawOutline(viewMatrix, pos) {
        this.setShader(this.gridShaderProgram);
        const translatedMatrix = mat4.create();
        mat4.copy(translatedMatrix, viewMatrix);
        mat4.translate(translatedMatrix, translatedMatrix, pos);
        this.prepareDraw(translatedMatrix);
        this.drawMesh(this.outlineMesh, { pos: true, color: true });
    }
}
//# sourceMappingURL=StructureRenderer.js.map