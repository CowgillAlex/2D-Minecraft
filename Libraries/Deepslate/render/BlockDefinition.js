import { glMatrix, mat4 } from '../../gl-matrix/esm/index.js';
import { Identifier } from '../core/index.js';
import { BlockColors } from './BlockColors.js';
import { Cull } from './Cull.js';
import { Mesh } from './Mesh.js';
export class BlockDefinition {
    id;
    variants;
    multipart;
    constructor(id, variants, multipart) {
        this.id = id;
        this.variants = variants;
        this.multipart = multipart;
        this.variants = variants;
    }
    getModelVariants(props) {
        if (this.variants) {
            const matches = Object.keys(this.variants).filter(v => this.matchesVariant(v, props));
            if (matches.length === 0)
                return [];
            const variant = this.variants[matches[0]];
            return [Array.isArray(variant) ? variant[0] : variant];
        }
        else if (this.multipart) {
            const matches = this.multipart.filter(p => p.when ? this.matchesCase(p.when, props) : true);
            return matches.map(p => Array.isArray(p.apply) ? p.apply[0] : p.apply);
        }
        return [];
    }
    getMesh(name, props, textureUVProvider, blockModelProvider, cull) {
        const variants = this.getModelVariants(props);
        const mesh = new Mesh();
        for (const variant of variants) {
            const newCull = Cull.rotate(cull, variant.x ?? 0, variant.y ?? 0);
            const blockModel = blockModelProvider.getBlockModel(Identifier.parse(variant.model));
            if (!blockModel) {
                throw new Error(`Cannot find block model ${variant.model}`);
            }
            const tint = BlockColors[name.path]?.(props);
            const variantMesh = blockModel.getMesh(textureUVProvider, newCull, tint);
            if (variant.x || variant.y) {
                const t = mat4.create();
                mat4.identity(t);
                mat4.translate(t, t, [8, 8, 8]);
                mat4.rotateY(t, t, -glMatrix.toRadian(variant.y ?? 0));
                mat4.rotateX(t, t, -glMatrix.toRadian(variant.x ?? 0));
                mat4.translate(t, t, [-8, -8, -8]);
                variantMesh.transform(t);
            }
            mesh.merge(variantMesh);
        }
        const t = mat4.create();
        mat4.identity(t);
        mat4.scale(t, t, [0.0625, 0.0625, 0.0625]);
        return mesh.transform(t);
    }
    matchesVariant(variant, props) {
        return variant.split(',').every(p => {
            const [k, v] = p.split('=');
            return props[k] === v;
        });
    }
    matchesCase(condition, props) {
        if (Array.isArray(condition.OR)) {
            return condition.OR.some(c => this.matchesCase(c, props));
        }
        const states = condition;
        return Object.keys(states).every(k => {
            const values = states[k].split('|');
            return values.includes(props[k]);
        });
    }
    static fromJson(id, data) {
        return new BlockDefinition(Identifier.parse(id), data.variants, data.multipart);
    }
}
//# sourceMappingURL=BlockDefinition.js.map