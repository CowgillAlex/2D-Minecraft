import { Holder, Identifier, Registry } from '../../core/index.js';
import { LegacyRandom } from '../../math/index.js';
import { Json } from '../../util/index.js';
import { StructurePlacement } from './StructurePlacement.js';
import { WorldgenStructure } from './WorldgenStructure.js';
export class StructureSet {
    structures;
    placement;
    static REGISTRY = Registry.createAndRegister('worldgen/structure_set', StructureSet.fromJson);
    constructor(structures, placement) {
        this.structures = structures;
        this.placement = placement;
    }
    static fromJson(obj) {
        const root = Json.readObject(obj) ?? {};
        const structures = Json.readArray(root.structures, (StructureSet.StructureSelectionEntry.fromJson)) ?? [];
        const placement = StructurePlacement.fromJson(root.placement);
        return new StructureSet(structures, placement);
    }
    getStructureInChunk(chunkX, chunkZ, context) {
        this.placement.prepare(context.biomeSource, context.randomState.sampler, context.seed);
        if (!this.placement.isStructureChunk(context.seed, chunkX, chunkZ)) {
            return undefined;
        }
        if (this.structures.length === 0)
            return undefined;
        if (this.structures.length === 1) {
            if (this.structures[0].structure.value().tryGenerate(chunkX, chunkZ, context)) {
                return this.structures[0].structure.key();
            }
        }
        else {
            const random = LegacyRandom.fromLargeFeatureSeed(context.seed, chunkX, chunkZ);
            const list = Object.assign([], this.structures);
            let totalWeight = list.reduce((v, e, i) => v + e.weight, 0);
            while (list.length > 0) {
                let weightIndex = random.nextInt(totalWeight);
                let id;
                let entry;
                for ([id, entry] of list.entries()) {
                    weightIndex -= entry.weight;
                    if (weightIndex < 0) {
                        break;
                    }
                }
                if (entry.structure.value().tryGenerate(chunkX, chunkZ, context)) {
                    return entry.structure.key();
                }
                list.splice(id, 1);
                totalWeight -= entry.weight;
            }
        }
        return undefined;
    }
}
(function (StructureSet) {
    class StructureSelectionEntry {
        structure;
        weight;
        constructor(structure, weight) {
            this.structure = structure;
            this.weight = weight;
        }
        static fromJson(obj) {
            const root = Json.readObject(obj) ?? {};
            return new StructureSelectionEntry(Holder.reference(WorldgenStructure.REGISTRY, Identifier.parse(Json.readString(root.structure) ?? 'minecraft:empty')), Json.readInt(root.weight) ?? 1);
        }
    }
    StructureSet.StructureSelectionEntry = StructureSelectionEntry;
})(StructureSet || (StructureSet = {}));
//# sourceMappingURL=StructureSet.js.map