import { mat4 } from '../../gl-matrix/esm/index.js';
import { ShaderProgram } from './ShaderProgram.js';
const vsSource = `
  attribute vec4 vertPos;
  attribute vec2 texCoord;
  attribute vec3 vertColor;
  attribute vec3 normal;

  uniform mat4 mView;
  uniform mat4 mProj;

  varying highp vec2 vTexCoord;
  varying highp vec3 vTintColor;
  varying highp float vLighting;

  void main(void) {
    gl_Position = mProj * mView * vertPos;
    vTexCoord = texCoord;
    vTintColor = vertColor;
    vLighting = normal.y * 0.2 + abs(normal.z) * 0.1 + 0.8;
  }
`;
const fsSource = `
  precision highp float;
  varying highp vec2 vTexCoord;
  varying highp vec3 vTintColor;
  varying highp float vLighting;

  uniform sampler2D sampler;

  void main(void) {
		vec4 texColor = texture2D(sampler, vTexCoord);
		if(texColor.a < 0.01) discard;
		gl_FragColor = vec4(texColor.xyz * vTintColor * vLighting, texColor.a);
  }
`;
export class Renderer {
    gl;
    shaderProgram;
    projMatrix;
    activeShader;
    constructor(gl) {
        this.gl = gl;
        this.shaderProgram = new ShaderProgram(gl, vsSource, fsSource).getProgram();
        this.activeShader = this.shaderProgram;
        this.projMatrix = this.getPerspective();
        this.initialize();
    }
    setViewport(x, y, width, height) {
        this.gl.viewport(x, y, width, height);
        this.projMatrix = this.getPerspective();
    }
    getPerspective() {
        const fieldOfView = 70 * Math.PI / 180;
        const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        const projMatrix = mat4.create();
        mat4.perspective(projMatrix, fieldOfView, aspect, 0.1, 500.0);
        return projMatrix;
    }
    initialize() {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
    }
    setShader(shader) {
        this.gl.useProgram(shader);
        this.activeShader = shader;
    }
    setVertexAttr(name, size, buffer) {
        if (buffer === undefined)
            throw new Error(`Expected buffer for ${name}`);
        const location = this.gl.getAttribLocation(this.activeShader, name);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.vertexAttribPointer(location, size, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(location);
    }
    setUniform(name, value) {
        const location = this.gl.getUniformLocation(this.activeShader, name);
        this.gl.uniformMatrix4fv(location, false, value);
    }
    setTexture(texture) {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    }
    createAtlasTexture(image) {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        return texture;
    }
    prepareDraw(viewMatrix) {
        this.setUniform('mView', viewMatrix);
        this.setUniform('mProj', this.projMatrix);
    }
    drawMesh(mesh, options) {
        if (mesh.quadVertices() > 0) {
            if (options.pos)
                this.setVertexAttr('vertPos', 3, mesh.posBuffer);
            if (options.color)
                this.setVertexAttr('vertColor', 3, mesh.colorBuffer);
            if (options.texture)
                this.setVertexAttr('texCoord', 2, mesh.textureBuffer);
            if (options.normal)
                this.setVertexAttr('normal', 3, mesh.normalBuffer);
            if (options.blockPos)
                this.setVertexAttr('blockPos', 3, mesh.blockPosBuffer);
            if (!mesh.indexBuffer)
                throw new Error('Expected index buffer');
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
            this.gl.drawElements(this.gl.TRIANGLES, mesh.quadIndices(), this.gl.UNSIGNED_SHORT, 0);
        }
        if (mesh.lineVertices() > 0) {
            if (options.pos)
                this.setVertexAttr('vertPos', 3, mesh.linePosBuffer);
            if (options.color)
                this.setVertexAttr('vertColor', 3, mesh.lineColorBuffer);
            this.gl.drawArrays(this.gl.LINES, 0, mesh.lineVertices());
        }
    }
}
//# sourceMappingURL=Renderer.js.map