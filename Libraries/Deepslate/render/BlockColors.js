import { clamp } from '../math/index.js';
import { intToRgb } from '../util/index.js';
const grass = [124 / 255, 189 / 255, 107 / 255];
const spruce = intToRgb(6396257);
const birch = intToRgb(8431445);
const foliage = intToRgb(4764952);
const water = intToRgb(4159204);
const attached_stem = intToRgb(8431445);
const lily_pad = intToRgb(2129968);
const redstone = (power) => {
    const a = power / 15;
    const r = a * 0.6 + (a > 0 ? 0.4 : 0.3);
    const g = clamp(a * a * 0.7 - 0.5, 0, 1);
    const b = clamp(a * a * 0.6 - 0.7, 0, 1);
    return [r, g, b];
};
const stem = (age) => {
    return [age / 8, 1 - age / 32, age * 64];
};
export const BlockColors = {
    large_fern: () => grass,
    tall_grass: () => grass,
    grass_block: () => grass,
    fern: () => grass,
    grass: () => grass,
    short_grass: () => grass,
    potted_fern: () => grass,
    pink_petals: () => grass,
    spruce_leaves: () => spruce,
    birch_leaves: () => birch,
    oak_leaves: () => foliage,
    jungle_leaves: () => foliage,
    acacia_leaves: () => foliage,
    dark_oak_leaves: () => foliage,
    vine: () => foliage,
    mangrove_leaves: () => foliage,
    water: () => water,
    bubble_column: () => water,
    cauldron: () => water,
    water_cauldron: () => water,
    redstone_wire: (props) => redstone(parseInt(props['power'] ?? '0')),
    sugar_cane: () => grass,
    attached_melon_stem: () => attached_stem,
    attached_pumpkin_stem: () => attached_stem,
    melon_stem: (props) => stem(parseInt(props['age'] ?? '0')),
    pumpkin_stem: (props) => stem(parseInt(props['age'] ?? '0')),
    lily_pad: () => lily_pad,
};
//# sourceMappingURL=BlockColors.js.map