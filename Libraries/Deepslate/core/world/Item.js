import { Identifier } from '../Identifier.js';
import { Registry } from '../Registry.js';
import { MobEffects } from './MobEffect.js';
import { MobEffectInstance } from './MobEffectInstance.js';
const slotIndices = {
    mainhand: 0,
    offhand: 1,
    feet: 0,
    legs: 1,
    chest: 2,
    head: 3,
};
const registry = new Registry(Identifier.create('item'));
Registry.REGISTRY.register(registry.key, registry);
export var Item;
(function (Item) {
    Item.REGISTRY = registry;
    function get(arg) {
        const id = typeof arg === 'string' ? Identifier.parse(arg) : arg;
        const item = registry.get(id);
        return item ?? { id, rarity: 'common', stack: 64 };
    }
    Item.get = get;
})(Item || (Item = {}));
function register(id, props) {
    const item = {
        id: Identifier.create(id),
        rarity: 'common',
        stack: 64,
        ...props,
        ...(props?.vanishable || props?.wearable) ? { vanishable: true } : {},
    };
    registry.register(item.id, item, true);
    return item;
}
function spawnEgg(entityType, background, highlight) {
    return {
        spawnEgg: {
            entityType,
            background,
            highlight,
        },
    };
}
function food(nutrition, saturationModifier, props) {
    return {
        food: {
            nutrition,
            saturationModifier,
            isMeat: false,
            canAlwaysEat: false,
            fastFood: false,
            effects: [],
            ...props,
        },
    };
}
const armorMaterials = {
    leather: [5, [1, 2, 3, 1], 15, 0, 0],
    chainmail: [15, [1, 4, 5, 2], 12, 0, 0],
    iron: [15, [2, 5, 6, 2], 12, 0, 0],
    gold: [7, [1, 3, 5, 2], 25, 0, 0],
    diamond: [33, [3, 6, 8, 3], 9, 2, 0],
    turtle: [25, [2, 5, 6, 2], 9, 0, 0],
    netherite: [37, [3, 6, 8, 3], 15, 3, 0.1],
};
function armor(slot, material) {
    const [durabilityMul, slotDefense, enchantmentValue, toughness, knockbackResistance] = armorMaterials[material];
    const slotIndex = slotIndices[slot];
    return {
        stack: 1,
        durability: [13, 15, 16, 11][slotIndex] * durabilityMul,
        enchantmentValue,
        ...material === 'netherite' ? { fireResistant: true } : {},
        wearable: true,
        armor: {
            slot,
            material,
            defense: slotDefense[slotIndex],
            toughness,
            knockbackResistance,
        },
    };
}
const itemTiers = {
    wood: [0, 59, 2, 0, 15],
    stone: [1, 131, 4, 1, 5],
    iron: [2, 250, 6, 2, 14],
    diamond: [3, 1561, 8, 3, 10],
    gold: [0, 32, 12, 0, 22],
    netherite: [4, 2031, 9, 4, 15],
};
function tiered(tier, type) {
    const [level, uses, speed, damage, enchantmentValue] = itemTiers[tier];
    return {
        durability: uses,
        enchantmentValue,
        ...tier === 'netherite' ? { fireResistant: true } : {},
        tiered: {
            tier,
            level,
            speed,
            damage,
            isWeapon: type === 'weapon',
            isDigger: type === 'digger' || type === 'axe',
            isAxe: type === 'axe',
        },
    };
}
export var Items;
(function (Items) {
    Items.AIR = register('air');
    Items.CARVED_PUMPKIN = register('carved_pumpkin', { wearable: true });
    Items.SADDLE = register('saddle', { stack: 1 });
    Items.MINECART = register('minecart', { stack: 1 });
    Items.CHEST_MINECART = register('chest_minecart', { stack: 1 });
    Items.FURNACE_MINECART = register('furnace_minecart', { stack: 1 });
    Items.TNT_MINECART = register('tnt_minecart', { stack: 1 });
    Items.HOPPER_MINECART = register('hopper_minecart', { stack: 1 });
    Items.CARROT_ON_A_STICK = register('carrot_on_a_stick', { stack: 1, durability: 25 });
    Items.WARPED_FUNGUS_ON_A_STICK = register('warped_fungus_on_a_stick', { stack: 1, durability: 100 });
    Items.ELYTRA = register('elytra', { rarity: 'uncommon', stack: 1, durability: 432, wearable: true });
    Items.OAK_BOAT = register('oak_boat', { stack: 1 });
    Items.OAK_CHEST_BOAT = register('oak_chest_boat', { stack: 1 });
    Items.SPRUCE_BOAT = register('spruce_boat', { stack: 1 });
    Items.SPRUCE_CHEST_BOAT = register('spruce_chest_boat', { stack: 1 });
    Items.BIRCH_BOAT = register('birch_boat', { stack: 1 });
    Items.BIRCH_CHEST_BOAT = register('birch_chest_boat', { stack: 1 });
    Items.JUNGLE_BOAT = register('jungle_boat', { stack: 1 });
    Items.JUNGLE_CHEST_BOAT = register('jungle_chest_boat', { stack: 1 });
    Items.ACACIA_BOAT = register('acacia_boat', { stack: 1 });
    Items.ACACIA_CHEST_BOAT = register('acacia_chest_boat', { stack: 1 });
    Items.DARK_OAK_BOAT = register('dark_oak_boat', { stack: 1 });
    Items.DARK_OAK_CHEST_BOAT = register('dark_oak_chest_boat', { stack: 1 });
    Items.MANGROVE_BOAT = register('mangrove_boat', { stack: 1 });
    Items.MANGROVE_CHEST_BOAT = register('mangrove_chest_boat', { stack: 1 });
    Items.BAMBOO_RAFT = register('bamboo_raft', { stack: 1 });
    Items.BAMBOO_CHEST_RAFT = register('bamboo_chest_raft', { stack: 1 });
    Items.STRUCTURE_BLOCK = register('structure_block', { rarity: 'epic' });
    Items.JIGSAW = register('jigsaw', { rarity: 'epic' });
    Items.TURTLE_HELMET = register('turtle_helmet', armor('head', 'turtle'));
    Items.FLINT_AND_STEEL = register('flint_and_steel', { stack: 1, durability: 64 });
    Items.APPLE = register('apple', food(4, 0.3));
    Items.BOW = register('bow', { stack: 1, durability: 384, enchantmentValue: 1 });
    Items.NETHERITE_INGOT = register('netherite_ingot', { fireResistant: true });
    Items.NETHERITE_SCRAP = register('netherite_scrap', { fireResistant: true });
    Items.WOODEN_SWORD = register('wooden_sword', tiered('wood', 'weapon'));
    Items.WOODEN_SHOVEL = register('wooden_shovel', tiered('wood', 'digger'));
    Items.WOODEN_PICKAXE = register('wooden_pickaxe', tiered('wood', 'digger'));
    Items.WOODEN_AXE = register('wooden_axe', tiered('wood', 'axe'));
    Items.WOODEN_HOE = register('wooden_hoe', tiered('wood', 'digger'));
    Items.STONE_SWORD = register('stone_sword', tiered('stone', 'weapon'));
    Items.STONE_SHOVEL = register('stone_shovel', tiered('stone', 'digger'));
    Items.STONE_PICKAXE = register('stone_pickaxe', tiered('stone', 'digger'));
    Items.STONE_AXE = register('stone_axe', tiered('stone', 'axe'));
    Items.STONE_HOE = register('stone_hoe', tiered('stone', 'digger'));
    Items.GOLDEN_SWORD = register('golden_sword', tiered('gold', 'weapon'));
    Items.GOLDEN_SHOVEL = register('golden_shovel', tiered('gold', 'digger'));
    Items.GOLDEN_PICKAXE = register('golden_pickaxe', tiered('gold', 'digger'));
    Items.GOLDEN_AXE = register('golden_axe', tiered('gold', 'axe'));
    Items.GOLDEN_HOE = register('golden_hoe', tiered('gold', 'digger'));
    Items.IRON_SWORD = register('iron_sword', tiered('iron', 'weapon'));
    Items.IRON_SHOVEL = register('iron_shovel', tiered('iron', 'digger'));
    Items.IRON_PICKAXE = register('iron_pickaxe', tiered('iron', 'digger'));
    Items.IRON_AXE = register('iron_axe', tiered('iron', 'axe'));
    Items.IRON_HOE = register('iron_hoe', tiered('iron', 'digger'));
    Items.DIAMOND_SWORD = register('diamond_sword', tiered('diamond', 'weapon'));
    Items.DIAMOND_SHOVEL = register('diamond_shovel', tiered('diamond', 'digger'));
    Items.DIAMOND_PICKAXE = register('diamond_pickaxe', tiered('diamond', 'digger'));
    Items.DIAMOND_AXE = register('diamond_axe', tiered('diamond', 'axe'));
    Items.DIAMOND_HOE = register('diamond_hoe', tiered('diamond', 'digger'));
    Items.NETHERITE_SWORD = register('netherite_sword', tiered('netherite', 'weapon'));
    Items.NETHERITE_SHOVEL = register('netherite_shovel', tiered('netherite', 'digger'));
    Items.NETHERITE_PICKAXE = register('netherite_pickaxe', tiered('netherite', 'digger'));
    Items.NETHERITE_AXE = register('netherite_axe', tiered('netherite', 'axe'));
    Items.NETHERITE_HOE = register('netherite_hoe', tiered('netherite', 'digger'));
    Items.MUSHROOM_STEW = register('mushroom_stew', { stack: 1, ...food(6, 0.6) });
    Items.BREAD = register('bread', food(5, 0.6));
    Items.LEATHER_HELMET = register('leather_helmet', armor('head', 'leather'));
    Items.LEATHER_CHESTPLATE = register('leather_chestplate', armor('chest', 'leather'));
    Items.LEATHER_LEGGINGS = register('leather_leggings', armor('legs', 'leather'));
    Items.LEATHER_BOOTS = register('leather_boots', armor('feet', 'leather'));
    Items.CHAINMAIL_HELMET = register('chainmail_helmet', armor('head', 'chainmail'));
    Items.CHAINMAIL_CHESTPLATE = register('chainmail_chestplate', armor('chest', 'chainmail'));
    Items.CHAINMAIL_LEGGINGS = register('chainmail_leggings', armor('legs', 'chainmail'));
    Items.CHAINMAIL_BOOTS = register('chainmail_boots', armor('feet', 'chainmail'));
    Items.IRON_HELMET = register('iron_helmet', armor('head', 'iron'));
    Items.IRON_CHESTPLATE = register('iron_chestplate', armor('chest', 'iron'));
    Items.IRON_LEGGINGS = register('iron_leggings', armor('legs', 'iron'));
    Items.IRON_BOOTS = register('iron_boots', armor('feet', 'iron'));
    Items.DIAMOND_HELMET = register('diamond_helmet', armor('head', 'diamond'));
    Items.DIAMOND_CHESTPLATE = register('diamond_chestplate', armor('chest', 'diamond'));
    Items.DIAMOND_LEGGINGS = register('diamond_leggings', armor('legs', 'diamond'));
    Items.DIAMOND_BOOTS = register('diamond_boots', armor('feet', 'diamond'));
    Items.GOLDEN_HELMET = register('golden_helmet', armor('head', 'gold'));
    Items.GOLDEN_CHESTPLATE = register('golden_chestplate', armor('chest', 'gold'));
    Items.GOLDEN_LEGGINGS = register('golden_leggings', armor('legs', 'gold'));
    Items.GOLDEN_BOOTS = register('golden_boots', armor('feet', 'gold'));
    Items.NETHERITE_HELMET = register('netherite_helmet', armor('head', 'netherite'));
    Items.NETHERITE_CHESTPLATE = register('netherite_chestplate', armor('chest', 'netherite'));
    Items.NETHERITE_LEGGINGS = register('netherite_leggings', armor('legs', 'netherite'));
    Items.NETHERITE_BOOTS = register('netherite_boots', armor('feet', 'netherite'));
    Items.PORKCHOP = register('porkchop', food(3, 0.3, { isMeat: true }));
    Items.COOKED_PORKCHOP = register('cooked_porkchop', food(8, 0.8, { isMeat: true }));
    Items.GOLDEN_APPLE = register('golden_apple', { rarity: 'rare', ...food(4, 1.2, { canAlwaysEat: true, effects: [
                [MobEffectInstance.create(MobEffects.REGENERATION, 100, 1), 1],
                [MobEffectInstance.create(MobEffects.ABSORPTION, 2400, 0), 1],
            ] }) });
    Items.ENCHANTED_GOLDEN_APPLE = register('enchanted_golden_apple', { rarity: 'epic', ...food(4, 1.2, { canAlwaysEat: true, effects: [
                [MobEffectInstance.create(MobEffects.REGENERATION, 400, 1), 1],
                [MobEffectInstance.create(MobEffects.RESISTANCE, 6000, 0), 1],
                [MobEffectInstance.create(MobEffects.FIRE_RESISTANCE, 6000, 0), 1],
                [MobEffectInstance.create(MobEffects.ABSORPTION, 2400, 3), 1],
            ] }) });
    Items.OAK_SIGN = register('oak_sign', { stack: 16 });
    Items.SPRUCE_SIGN = register('spruce_sign', { stack: 16 });
    Items.BIRCH_SIGN = register('birch_sign', { stack: 16 });
    Items.JUNGLE_SIGN = register('jungle_sign', { stack: 16 });
    Items.ACACIA_SIGN = register('acacia_sign', { stack: 16 });
    Items.DARK_OAK_SIGN = register('dark_oak_sign', { stack: 16 });
    Items.MANGROVE_SIGN = register('mangrove_sign', { stack: 16 });
    Items.BAMBOO_SIGN = register('bamboo_sign', { stack: 16 });
    Items.CRIMSON_SIGN = register('crimson_sign', { stack: 16 });
    Items.WARPED_SIGN = register('warped_sign', { stack: 16 });
    Items.OAK_HANGING_SIGN = register('oak_hanging_sign', { stack: 16 });
    Items.SPRUCE_HANGING_SIGN = register('spruce_hanging_sign', { stack: 16 });
    Items.BIRCH_HANGING_SIGN = register('birch_hanging_sign', { stack: 16 });
    Items.JUNGLE_HANGING_SIGN = register('jungle_hanging_sign', { stack: 16 });
    Items.ACACIA_HANGING_SIGN = register('acacia_hanging_sign', { stack: 16 });
    Items.DARK_OAK_HANGING_SIGN = register('dark_oak_hanging_sign', { stack: 16 });
    Items.MANGROVE_HANGING_SIGN = register('mangrove_hanging_sign', { stack: 16 });
    Items.BAMBOO_HANGING_SIGN = register('bamboo_hanging_sign', { stack: 16 });
    Items.CRIMSON_HANGING_SIGN = register('crimson_hanging_sign', { stack: 16 });
    Items.WARPED_HANGING_SIGN = register('warped_hanging_sign', { stack: 16 });
    Items.BUCKET = register('bucket', { stack: 16 });
    Items.WATER_BUCKET = register('water_bucket', { stack: 1, craftRemainder: Items.BUCKET });
    Items.LAVA_BUCKET = register('lava_bucket', { stack: 1, craftRemainder: Items.BUCKET });
    Items.POWDER_SNOW_BUCKET = register('powder_snow_bucket', { stack: 1 });
    Items.SNOWBALL = register('snowball', { stack: 16 });
    Items.MILK_BUCKET = register('milk_bucket', { stack: 1, craftRemainder: Items.BUCKET });
    Items.PUFFERFISH_BUCKET = register('pufferfish_bucket', { stack: 1 });
    Items.SALMON_BUCKET = register('salmon_bucket', { stack: 1 });
    Items.COD_BUCKET = register('cod_bucket', { stack: 1 });
    Items.TROPICAL_FISH_BUCKET = register('tropical_fish_bucket', { stack: 1 });
    Items.AXOLOTL_BUCKET = register('axolotl_bucket', { stack: 1 });
    Items.TADPOLE_BUCKET = register('tadpole_bucket', { stack: 1 });
    Items.BOOK = register('book', { enchantmentValue: 1 });
    Items.EGG = register('egg', { stack: 16 });
    Items.COMPASS = register('compass', { vanishable: true });
    Items.BUNDLE = register('bundle', { stack: 1 });
    Items.FISHING_ROD = register('fishing_rod', { stack: 1, durability: 64, enchantmentValue: 1 });
    Items.SPYGLASS = register('spyglass', { stack: 1 });
    Items.COD = register('cod', food(2, 0.1));
    Items.SALMON = register('salmon', food(2, 0.1));
    Items.TROPICAL_FISH = register('tropical_fish', food(1, 0.1));
    Items.PUFFERFISH = register('pufferfish', food(1, 0.1, { effects: [
            [MobEffectInstance.create(MobEffects.POISON, 1200, 1), 1],
            [MobEffectInstance.create(MobEffects.HUNGER, 300, 2), 1],
            [MobEffectInstance.create(MobEffects.NAUSEA, 300, 0), 1],
        ] }));
    Items.COOKED_COD = register('cooked_cod', food(5, 0.6));
    Items.COOKED_SALMON = register('cooked_salmon', food(6, 0.8));
    Items.CAKE = register('cake', { stack: 1 });
    Items.WHITE_BED = register('white_bed', { stack: 1 });
    Items.ORANGE_BED = register('orange_bed', { stack: 1 });
    Items.MAGENTA_BED = register('magenta_bed', { stack: 1 });
    Items.LIGHT_BLUE_BED = register('light_blue_bed', { stack: 1 });
    Items.YELLOW_BED = register('yellow_bed', { stack: 1 });
    Items.LIME_BED = register('lime_bed', { stack: 1 });
    Items.PINK_BED = register('pink_bed', { stack: 1 });
    Items.GRAY_BED = register('gray_bed', { stack: 1 });
    Items.LIGHT_GRAY_BED = register('light_gray_bed', { stack: 1 });
    Items.CYAN_BED = register('cyan_bed', { stack: 1 });
    Items.PURPLE_BED = register('purple_bed', { stack: 1 });
    Items.BLUE_BED = register('blue_bed', { stack: 1 });
    Items.BROWN_BED = register('brown_bed', { stack: 1 });
    Items.GREEN_BED = register('green_bed', { stack: 1 });
    Items.RED_BED = register('red_bed', { stack: 1 });
    Items.BLACK_BED = register('black_bed', { stack: 1 });
    Items.COOKIE = register('cookie', food(2, 0.1));
    Items.SHEARS = register('shears', { stack: 1, durability: 238 });
    Items.MELON_SLICE = register('melon_slice', food(2, 0.3));
    Items.DRIED_KELP = register('dried_kelp', food(1, 0.3, { fastFood: true }));
    Items.BEEF = register('beef', food(3, 0.3, { isMeat: true }));
    Items.COOKED_BEEF = register('cooked_beef', food(8, 0.8, { isMeat: true }));
    Items.CHICKEN = register('chicken', food(2, 0.3, { isMeat: true, effects: [
            [MobEffectInstance.create(MobEffects.HUNGER, 600, 0), 0.3],
        ] }));
    Items.COOKED_CHICKEN = register('cooked_chicken', food(6, 0.6, { isMeat: true }));
    Items.ROTTEN_FLESH = register('rotten_flesh', food(4, 0.1, { isMeat: true, effects: [
            [MobEffectInstance.create(MobEffects.HUNGER, 600, 0), 0.8],
        ] }));
    Items.ENDER_PEARL = register('ender_pearl', { stack: 16 });
    Items.POTION = register('potion', { stack: 1 });
    Items.GLASS_BOTTLE = register('glass_bottle');
    Items.SPIDER_EYE = register('spider_eye', food(2, 0.8, { effects: [
            [MobEffectInstance.create(MobEffects.POISON, 100, 0), 1],
        ] }));
    Items.ALLAY_SPAWN_EGG = register('allay_spawn_egg', spawnEgg('allay', 56063, 44543));
    Items.AXOLOTL_SPAWN_EGG = register('axolotl_spawn_egg', spawnEgg('axolotl', 16499171, 10890612));
    Items.BAT_SPAWN_EGG = register('bat_spawn_egg', spawnEgg('bat', 4996656, 986895));
    Items.BEE_SPAWN_EGG = register('bee_spawn_egg', spawnEgg('bee', 15582019, 4400155));
    Items.BLAZE_SPAWN_EGG = register('blaze_spawn_egg', spawnEgg('blaze', 16167425, 16775294));
    Items.CAT_SPAWN_EGG = register('cat_spawn_egg', spawnEgg('cat', 15714446, 9794134));
    Items.CAMEL_SPAWN_EGG = register('camel_spawn_egg', spawnEgg('camel', 16565097, 13341495));
    Items.CAVE_SPIDER_SPAWN_EGG = register('cave_spider_spawn_egg', spawnEgg('cave_spider', 803406, 11013646));
    Items.CHICKEN_SPAWN_EGG = register('chicken_spawn_egg', spawnEgg('chicken', 10592673, 16711680));
    Items.COD_SPAWN_EGG = register('cod_spawn_egg', spawnEgg('cod', 12691306, 15058059));
    Items.COW_SPAWN_EGG = register('cow_spawn_egg', spawnEgg('cow', 4470310, 10592673));
    Items.CREEPER_SPAWN_EGG = register('creeper_spawn_egg', spawnEgg('creeper', 894731, 0));
    Items.DOLPHIN_SPAWN_EGG = register('dolphin_spawn_egg', spawnEgg('dolphin', 2243405, 16382457));
    Items.DONKEY_SPAWN_EGG = register('donkey_spawn_egg', spawnEgg('donkey', 5457209, 8811878));
    Items.DROWNED_SPAWN_EGG = register('drowned_spawn_egg', spawnEgg('drowned', 9433559, 7969893));
    Items.ELDER_GUARDIAN_SPAWN_EGG = register('elder_guardian_spawn_egg', spawnEgg('elder_guardian', 13552826, 7632531));
    Items.ENDER_DRAGON_SPAWN_EGG = register('ender_dragon_spawn_egg', spawnEgg('ender_dragon', 1842204, 14711290));
    Items.ENDERMAN_SPAWN_EGG = register('enderman_spawn_egg', spawnEgg('enderman', 1447446, 0));
    Items.ENDERMITE_SPAWN_EGG = register('endermite_spawn_egg', spawnEgg('endermite', 1447446, 7237230));
    Items.EVOKER_SPAWN_EGG = register('evoker_spawn_egg', spawnEgg('evoker', 9804699, 1973274));
    Items.FOX_SPAWN_EGG = register('fox_spawn_egg', spawnEgg('fox', 14005919, 13396256));
    Items.FROG_SPAWN_EGG = register('frog_spawn_egg', spawnEgg('frog', 13661252, 16762748));
    Items.GHAST_SPAWN_EGG = register('ghast_spawn_egg', spawnEgg('ghast', 16382457, 12369084));
    Items.GLOW_SQUID_SPAWN_EGG = register('glow_squid_spawn_egg', spawnEgg('glow_squid', 611926, 8778172));
    Items.GOAT_SPAWN_EGG = register('goat_spawn_egg', spawnEgg('goat', 10851452, 5589310));
    Items.GUARDIAN_SPAWN_EGG = register('guardian_spawn_egg', spawnEgg('guardian', 5931634, 15826224));
    Items.HOGLIN_SPAWN_EGG = register('hoglin_spawn_egg', spawnEgg('hoglin', 13004373, 6251620));
    Items.HORSE_SPAWN_EGG = register('horse_spawn_egg', spawnEgg('horse', 12623485, 15656192));
    Items.HUSK_SPAWN_EGG = register('husk_spawn_egg', spawnEgg('husk', 7958625, 15125652));
    Items.IRON_GOLEM_SPAWN_EGG = register('iron_golem_spawn_egg', spawnEgg('iron_golem', 14405058, 7643954));
    Items.LLAMA_SPAWN_EGG = register('llama_spawn_egg', spawnEgg('llama', 12623485, 10051392));
    Items.MAGMA_CUBE_SPAWN_EGG = register('magma_cube_spawn_egg', spawnEgg('magma_cube', 3407872, 16579584));
    Items.MOOSHROOM_SPAWN_EGG = register('mooshroom_spawn_egg', spawnEgg('mooshroom', 10489616, 12040119));
    Items.MULE_SPAWN_EGG = register('mule_spawn_egg', spawnEgg('mule', 1769984, 5321501));
    Items.OCELOT_SPAWN_EGG = register('ocelot_spawn_egg', spawnEgg('ocelot', 15720061, 5653556));
    Items.PANDA_SPAWN_EGG = register('panda_spawn_egg', spawnEgg('panda', 15198183, 1776418));
    Items.PARROT_SPAWN_EGG = register('parrot_spawn_egg', spawnEgg('parrot', 894731, 16711680));
    Items.PHANTOM_SPAWN_EGG = register('phantom_spawn_egg', spawnEgg('phantom', 4411786, 8978176));
    Items.PIG_SPAWN_EGG = register('pig_spawn_egg', spawnEgg('pig', 15771042, 14377823));
    Items.PIGLIN_SPAWN_EGG = register('piglin_spawn_egg', spawnEgg('piglin', 10051392, 16380836));
    Items.PIGLIN_BRUTE_SPAWN_EGG = register('piglin_brute_spawn_egg', spawnEgg('piglin_brute', 5843472, 16380836));
    Items.PILLAGER_SPAWN_EGG = register('pillager_spawn_egg', spawnEgg('pillager', 5451574, 9804699));
    Items.POLAR_BEAR_SPAWN_EGG = register('polar_bear_spawn_egg', spawnEgg('polar_bear', 15658718, 14014157));
    Items.PUFFERFISH_SPAWN_EGG = register('pufferfish_spawn_egg', spawnEgg('pufferfish', 16167425, 3654642));
    Items.RABBIT_SPAWN_EGG = register('rabbit_spawn_egg', spawnEgg('rabbit', 10051392, 7555121));
    Items.RAVAGER_SPAWN_EGG = register('ravager_spawn_egg', spawnEgg('ravager', 7697520, 5984329));
    Items.SALMON_SPAWN_EGG = register('salmon_spawn_egg', spawnEgg('salmon', 10489616, 951412));
    Items.SHEEP_SPAWN_EGG = register('sheep_spawn_egg', spawnEgg('sheep', 15198183, 16758197));
    Items.SHULKER_SPAWN_EGG = register('shulker_spawn_egg', spawnEgg('shulker', 9725844, 5060690));
    Items.SILVERFISH_SPAWN_EGG = register('silverfish_spawn_egg', spawnEgg('silverfish', 7237230, 3158064));
    Items.SKELETON_SPAWN_EGG = register('skeleton_spawn_egg', spawnEgg('skeleton', 12698049, 4802889));
    Items.SKELETON_HORSE_SPAWN_EGG = register('skeleton_horse_spawn_egg', spawnEgg('skeleton_horse', 6842447, 15066584));
    Items.SLIME_SPAWN_EGG = register('slime_spawn_egg', spawnEgg('slime', 5349438, 8306542));
    Items.SNOW_GOLEM_SPAWN_EGG = register('snow_golem_spawn_egg', spawnEgg('snow_golem', 14283506, 8496292));
    Items.SPIDER_SPAWN_EGG = register('spider_spawn_egg', spawnEgg('spider', 3419431, 11013646));
    Items.SQUID_SPAWN_EGG = register('squid_spawn_egg', spawnEgg('squid', 2243405, 7375001));
    Items.STRAY_SPAWN_EGG = register('stray_spawn_egg', spawnEgg('stray', 6387319, 14543594));
    Items.STRIDER_SPAWN_EGG = register('strider_spawn_egg', spawnEgg('strider', 10236982, 5065037));
    Items.TADPOLE_SPAWN_EGG = register('tadpole_spawn_egg', spawnEgg('tadpole', 7164733, 1444352));
    Items.TRADER_LLAMA_SPAWN_EGG = register('trader_llama_spawn_egg', spawnEgg('trader_llama', 15377456, 4547222));
    Items.TROPICAL_FISH_SPAWN_EGG = register('tropical_fish_spawn_egg', spawnEgg('tropical_fish', 15690005, 16775663));
    Items.TURTLE_SPAWN_EGG = register('turtle_spawn_egg', spawnEgg('turtle', 15198183, 44975));
    Items.VEX_SPAWN_EGG = register('vex_spawn_egg', spawnEgg('vex', 8032420, 15265265));
    Items.VILLAGER_SPAWN_EGG = register('villager_spawn_egg', spawnEgg('villager', 5651507, 12422002));
    Items.VINDICATOR_SPAWN_EGG = register('vindicator_spawn_egg', spawnEgg('vindicator', 9804699, 2580065));
    Items.WANDERING_TRADER_SPAWN_EGG = register('wandering_trader_spawn_egg', spawnEgg('wandering_trader', 4547222, 15377456));
    Items.WARDEN_SPAWN_EGG = register('warden_spawn_egg', spawnEgg('warden', 1001033, 3790560));
    Items.WITCH_SPAWN_EGG = register('witch_spawn_egg', spawnEgg('witch', 3407872, 5349438));
    Items.WITHER_SPAWN_EGG = register('wither_spawn_egg', spawnEgg('wither', 1315860, 5075616));
    Items.WITHER_SKELETON_SPAWN_EGG = register('wither_skeleton_spawn_egg', spawnEgg('wither_skeleton', 1315860, 4672845));
    Items.WOLF_SPAWN_EGG = register('wolf_spawn_egg', spawnEgg('wolf', 14144467, 13545366));
    Items.ZOGLIN_SPAWN_EGG = register('zoglin_spawn_egg', spawnEgg('zoglin', 13004373, 15132390));
    Items.ZOMBIE_SPAWN_EGG = register('zombie_spawn_egg', spawnEgg('zombie', 44975, 7969893));
    Items.ZOMBIE_HORSE_SPAWN_EGG = register('zombie_horse_spawn_egg', spawnEgg('zombie_horse', 3232308, 9945732));
    Items.ZOMBIE_VILLAGER_SPAWN_EGG = register('zombie_villager_spawn_egg', spawnEgg('zombie_villager', 5651507, 7969893));
    Items.ZOMBIFIED_PIGLIN_SPAWN_EGG = register('zombified_piglin_spawn_egg', spawnEgg('zombified_piglin', 15373203, 5009705));
    Items.EXPERIENCE_BOTTLE = register('experience_bottle', { rarity: 'uncommon' });
    Items.WRITABLE_BOOK = register('writable_book', { stack: 1 });
    Items.WRITTEN_BOOK = register('written_book', { stack: 16 });
    Items.CARROT = register('carrot', food(3, 0.6));
    Items.POTATO = register('potato', food(1, 0.3));
    Items.BAKED_POTATO = register('baked_potato', food(5, 0.6));
    Items.POISONOUS_POTATO = register('poisonous_potato', food(2, 0.3, { effects: [
            [MobEffectInstance.create(MobEffects.POISON, 100, 0), 0.6],
        ] }));
    Items.GOLDEN_CARROT = register('golden_carrot', food(6, 1.2));
    Items.SKELETON_SKULL = register('skeleton_skull', { rarity: 'uncommon', wearable: true });
    Items.WITHER_SKELETON_SKULL = register('wither_skeleton_skull', { rarity: 'uncommon', wearable: true });
    Items.PLAYER_HEAD = register('player_head', { rarity: 'uncommon', wearable: true });
    Items.ZOMBIE_HEAD = register('zombie_head', { rarity: 'uncommon', wearable: true });
    Items.CREEPER_HEAD = register('creeper_head', { rarity: 'uncommon', wearable: true });
    Items.DRAGON_HEAD = register('dragon_head', { rarity: 'uncommon', wearable: true });
    Items.PIGLIN_HEAD = register('piglin_head', { rarity: 'uncommon', wearable: true });
    Items.NETHER_STAR = register('nether_star', { rarity: 'uncommon' });
    Items.PUMPKIN_PIE = register('pumpkin_pie', food(8, 0.3));
    Items.ENCHANTED_BOOK = register('enchanted_book', { rarity: 'uncommon', stack: 1 });
    Items.RABBIT = register('rabbit', food(3, 0.3, { isMeat: true }));
    Items.COOKED_RABBIT = register('cooked_rabbit', food(5, 0.6, { isMeat: true }));
    Items.RABBIT_STEW = register('rabbit_stew', { stack: 1, ...food(10, 0.6) });
    Items.ARMOR_STAND = register('armor_stand', { stack: 16 });
    Items.IRON_HORSE_ARMOR = register('iron_horse_armor', { stack: 1 });
    Items.GOLDEN_HORSE_ARMOR = register('golden_horse_armor', { stack: 1 });
    Items.DIAMOND_HORSE_ARMOR = register('diamond_horse_armor', { stack: 1 });
    Items.LEATHER_HORSE_ARMOR = register('leather_horse_armor', { stack: 1 });
    Items.COMMAND_BLOCK_MINECART = register('command_block_minecart', { rarity: 'epic', stack: 1 });
    Items.MUTTON = register('mutton', food(2, 0.3, { isMeat: true }));
    Items.COOKED_MUTTON = register('cooked_mutton', food(6, 0.8, { isMeat: true }));
    Items.WHITE_BANNER = register('white_banner', { stack: 16 });
    Items.ORANGE_BANNER = register('orange_banner', { stack: 16 });
    Items.MAGENTA_BANNER = register('magenta_banner', { stack: 16 });
    Items.LIGHT_BLUE_BANNER = register('light_blue_banner', { stack: 16 });
    Items.YELLOW_BANNER = register('yellow_banner', { stack: 16 });
    Items.LIME_BANNER = register('lime_banner', { stack: 16 });
    Items.PINK_BANNER = register('pink_banner', { stack: 16 });
    Items.GRAY_BANNER = register('gray_banner', { stack: 16 });
    Items.LIGHT_GRAY_BANNER = register('light_gray_banner', { stack: 16 });
    Items.CYAN_BANNER = register('cyan_banner', { stack: 16 });
    Items.PURPLE_BANNER = register('purple_banner', { stack: 16 });
    Items.BLUE_BANNER = register('blue_banner', { stack: 16 });
    Items.BROWN_BANNER = register('brown_banner', { stack: 16 });
    Items.GREEN_BANNER = register('green_banner', { stack: 16 });
    Items.RED_BANNER = register('red_banner', { stack: 16 });
    Items.BLACK_BANNER = register('black_banner', { stack: 16 });
    Items.END_CRYSTAL = register('end_crystal', { rarity: 'rare' });
    Items.CHORUS_FRUIT = register('chorus_fruit', food(4, 0.3, { canAlwaysEat: true }));
    Items.BEETROOT = register('beetroot', food(1, 0.6));
    Items.BEETROOT_SOUP = register('beetroot_soup', { stack: 1, ...food(6, 0.6) });
    Items.DRAGON_BREATH = register('dragon_breath', { rarity: 'uncommon', craftRemainder: Items.GLASS_BOTTLE });
    Items.SPLASH_POTION = register('splash_potion', { stack: 1 });
    Items.LINGERING_POTION = register('lingering_potion', { stack: 1 });
    Items.SHIELD = register('shield', { stack: 1, durability: 336 });
    Items.TOTEM_OF_UNDYING = register('totem_of_undying', { rarity: 'uncommon', stack: 1 });
    Items.KNOWLEDGE_BOOK = register('knowledge_book', { rarity: 'epic', stack: 1 });
    Items.DEBUG_STICK = register('debug_stick', { rarity: 'epic', stack: 1 });
    Items.MUSIC_DISC_13 = register('music_disc_13', { rarity: 'rare', stack: 1 });
    Items.MUSIC_DISC_CAT = register('music_disc_cat', { rarity: 'rare', stack: 1 });
    Items.MUSIC_DISC_BLOCKS = register('music_disc_blocks', { rarity: 'rare', stack: 1 });
    Items.MUSIC_DISC_CHIRP = register('music_disc_chirp', { rarity: 'rare', stack: 1 });
    Items.MUSIC_DISC_FAR = register('music_disc_far', { rarity: 'rare', stack: 1 });
    Items.MUSIC_DISC_MALL = register('music_disc_mall', { rarity: 'rare', stack: 1 });
    Items.MUSIC_DISC_MELLOHI = register('music_disc_mellohi', { rarity: 'rare', stack: 1 });
    Items.MUSIC_DISC_STAL = register('music_disc_stal', { rarity: 'rare', stack: 1 });
    Items.MUSIC_DISC_STRAD = register('music_disc_strad', { rarity: 'rare', stack: 1 });
    Items.MUSIC_DISC_WARD = register('music_disc_ward', { rarity: 'rare', stack: 1 });
    Items.MUSIC_DISC_11 = register('music_disc_11', { rarity: 'rare', stack: 1 });
    Items.MUSIC_DISC_WAIT = register('music_disc_wait', { rarity: 'rare', stack: 1 });
    Items.MUSIC_DISC_OTHERSIDE = register('music_disc_otherside', { rarity: 'rare', stack: 1 });
    Items.MUSIC_DISC_5 = register('music_disc_5', { rarity: 'rare', stack: 1 });
    Items.MUSIC_DISC_PIGSTEP = register('music_disc_pigstep', { rarity: 'rare', stack: 1 });
    Items.TRIDENT = register('trident', { stack: 1, durability: 250, enchantmentValue: 1 });
    Items.HEART_OF_THE_SEA = register('heart_of_the_sea', { rarity: 'uncommon' });
    Items.CROSSBOW = register('crossbow', { stack: 1, durability: 465, enchantmentValue: 1 });
    Items.SUSPICIOUS_STEW = register('suspicious_stew', { stack: 1, ...food(6, 0.6, { canAlwaysEat: true }) });
    Items.FLOWER_BANNER_PATTERN = register('flower_banner_pattern', { stack: 1 });
    Items.CREEPER_BANNER_PATTERN = register('creeper_banner_pattern', { rarity: 'uncommon', stack: 1 });
    Items.SKULL_BANNER_PATTERN = register('skull_banner_pattern', { rarity: 'uncommon', stack: 1 });
    Items.MOJANG_BANNER_PATTERN = register('mojang_banner_pattern', { rarity: 'epic', stack: 1 });
    Items.GLOBE_BANNER_PATTERN = register('globe_banner_pattern', { stack: 1 });
    Items.PIGLIN_BANNER_PATTERN = register('piglin_banner_pattern', { stack: 1 });
    Items.GOAT_HORN = register('goat_horn', { stack: 1 });
    Items.SWEET_BERRIES = register('sweet_berries', food(2, 0.1));
    Items.GLOW_BERRIES = register('glow_berries', food(2, 0.1));
    Items.HONEY_BOTTLE = register('honey_bottle', { stack: 16, craftRemainder: Items.GLASS_BOTTLE, ...food(6, 0.1) });
})(Items || (Items = {}));
//# sourceMappingURL=Item.js.map