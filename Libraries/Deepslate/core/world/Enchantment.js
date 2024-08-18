import { Identifier } from '../Identifier.js';
import { Registry } from '../Registry.js';
const registry = new Registry(Identifier.create('enchantment'));
Registry.REGISTRY.register(registry.key, registry);
export var Enchantment;
(function (Enchantment) {
    Enchantment.REGISTRY = registry;
    function isCompatible(a, b) {
        return a !== b && a._isCompatible(b) && b._isCompatible(a);
    }
    Enchantment.isCompatible = isCompatible;
    function canEnchant(item, ench) {
        return ench._canEnchant(item, () => ENCHANTMENT_CATEGORIES.get(ench.category)?.(item.getItem()) ?? false);
    }
    Enchantment.canEnchant = canEnchant;
})(Enchantment || (Enchantment = {}));
function register(id, rarity, category, props) {
    const enchantment = {
        id: Identifier.create(id),
        rarity,
        category,
        isDiscoverable: true,
        isTradeable: true,
        isTreasure: false,
        isCurse: false,
        minLevel: 1,
        maxLevel: 1,
        minCost(lvl) { return 1 + lvl * 10; },
        maxCost(lvl) { return this.minCost(lvl) + 5; },
        _isCompatible() { return true; },
        _canEnchant(_, next) { return next(); },
        ...props,
    };
    registry.register(enchantment.id, enchantment, true);
    return enchantment;
}
export var Enchantments;
(function (Enchantments) {
    Enchantments.PROTECTION = register('protection', 'common', 'armor', {
        maxLevel: 4,
        minCost: lvl => 1 + (lvl - 1) * 11,
        maxCost: lvl => 1 + (lvl - 1) * 11 + 11,
        _isCompatible: other => !PROTECTION_ENCHANTS.has(other),
    });
    Enchantments.FIRE_PROTECTION = register('fire_protection', 'uncommon', 'armor', {
        maxLevel: 4,
        minCost: lvl => 10 + (lvl - 1) * 8,
        maxCost: lvl => 10 + (lvl - 1) * 8 + 8,
        _isCompatible: other => !PROTECTION_ENCHANTS.has(other),
    });
    Enchantments.FEATHER_FALLING = register('feather_falling', 'uncommon', 'armor_feet', {
        maxLevel: 4,
        minCost: lvl => 5 + (lvl - 1) * 6,
        maxCost: lvl => 5 + (lvl - 1) * 6 + 6,
    });
    Enchantments.BLAST_PROTECTION = register('blast_protection', 'rare', 'armor', {
        maxLevel: 4,
        minCost: lvl => 5 + (lvl - 1) * 8,
        maxCost: lvl => 5 + (lvl - 1) * 8 + 8,
        _isCompatible: other => !PROTECTION_ENCHANTS.has(other),
    });
    Enchantments.PROJECTILE_PROTECTION = register('projectile_protection', 'uncommon', 'armor', {
        maxLevel: 4,
        minCost: lvl => 3 + (lvl - 1) * 6,
        maxCost: lvl => 3 + (lvl - 1) * 6 + 6,
        _isCompatible: other => !PROTECTION_ENCHANTS.has(other),
    });
    Enchantments.RESPIRATION = register('respiration', 'rare', 'armor_head', {
        maxLevel: 3,
        minCost: lvl => 10 * lvl,
        maxCost: lvl => 10 * lvl + 30,
    });
    Enchantments.AQUA_AFFINITY = register('aqua_affinity', 'rare', 'armor_head', {
        minCost: () => 1,
        maxCost: () => 40,
    });
    Enchantments.THORNS = register('thorns', 'very_rare', 'armor_chest', {
        maxLevel: 3,
        minCost: lvl => 10 + 20 * (lvl - 1),
        maxCost: lvl => 10 + 20 * (lvl - 1) + 50,
    });
    Enchantments.DEPTH_STRIDER = register('depth_strider', 'rare', 'armor_feet', {
        maxLevel: 3,
        minCost: lvl => 10 * lvl,
        maxCost: lvl => 10 * lvl + 15,
        _isCompatible: other => other !== Enchantments.FROST_WALKER,
    });
    Enchantments.FROST_WALKER = register('frost_walker', 'rare', 'armor_feet', {
        isTreasure: true,
        maxLevel: 2,
        minCost: lvl => 10 * lvl,
        maxCost: lvl => 10 * lvl + 15,
        _isCompatible: other => other !== Enchantments.DEPTH_STRIDER,
    });
    Enchantments.BINDING_CURSE = register('binding_curse', 'very_rare', 'wearable', {
        isTreasure: true,
        isCurse: true,
        minCost: () => 25,
        maxCost: () => 50,
    });
    Enchantments.SOUL_SPEED = register('soul_speed', 'very_rare', 'armor_feet', {
        isDiscoverable: false,
        isTradeable: false,
        isTreasure: true,
        maxLevel: 3,
        minCost: lvl => 10 * lvl,
        maxCost: lvl => 10 * lvl + 15,
    });
    Enchantments.SWIFT_SNEAK = register('swift_sneak', 'very_rare', 'armor_legs', {
        isDiscoverable: false,
        isTradeable: false,
        isTreasure: true,
        maxLevel: 3,
        minCost: lvl => 25 * lvl,
        maxCost: lvl => 25 * lvl + 50,
    });
    Enchantments.SHARPNESS = register('sharpness', 'common', 'weapon', {
        maxLevel: 5,
        minCost: lvl => 1 + (lvl - 1) * 11,
        maxCost: lvl => 1 + (lvl - 1) * 11 + 20,
        _isCompatible: other => !DAMAGE_ENCHANTS.has(other),
        _canEnchant: (item, next) => item.getItem().tiered?.isAxe || next(),
    });
    Enchantments.SMITE = register('smite', 'common', 'weapon', {
        maxLevel: 5,
        minCost: lvl => 5 + (lvl - 1) * 8,
        maxCost: lvl => 5 + (lvl - 1) * 8 + 20,
        _isCompatible: other => !DAMAGE_ENCHANTS.has(other),
        _canEnchant: (item, next) => item.getItem().tiered?.isAxe || next(),
    });
    Enchantments.BANE_OF_ARTHROPODS = register('bane_of_arthropods', 'common', 'weapon', {
        maxLevel: 5,
        minCost: lvl => 5 + (lvl - 1) * 8,
        maxCost: lvl => 5 + (lvl - 1) * 8 + 20,
        _isCompatible: other => !DAMAGE_ENCHANTS.has(other),
        _canEnchant: (item, next) => item.getItem().tiered?.isAxe || next(),
    });
    Enchantments.KNOCKBACK = register('knockback', 'uncommon', 'weapon', {
        maxLevel: 2,
        minCost: lvl => 5 + 20 * (lvl - 1),
        maxCost: lvl => 1 + lvl * 10 + 50,
    });
    Enchantments.FIRE_ASPECT = register('fire_aspect', 'rare', 'weapon', {
        maxLevel: 2,
        minCost: lvl => 5 + 20 * (lvl - 1),
        maxCost: lvl => 1 + lvl * 10 + 50,
    });
    Enchantments.LOOTING = register('looting', 'rare', 'weapon', {
        maxLevel: 3,
        minCost: lvl => 15 + (lvl - 1) * 9,
        maxCost: lvl => 1 + lvl * 10 + 50,
        _isCompatible: other => other !== Enchantments.SILK_TOUCH,
    });
    Enchantments.SWEEPING = register('sweeping', 'rare', 'weapon', {
        maxLevel: 3,
        minCost: lvl => 5 + (lvl - 1) * 9,
        maxCost: lvl => 5 + (lvl - 1) * 9 + 15,
    });
    Enchantments.EFFICIENCY = register('efficiency', 'common', 'digger', {
        maxLevel: 5,
        minCost: lvl => 1 + 10 * (lvl - 1),
        maxCost: lvl => 1 + lvl * 10 + 50,
        _canEnchant: (item, next) => item.is('shears') || next(),
    });
    Enchantments.SILK_TOUCH = register('silk_touch', 'very_rare', 'digger', {
        minCost: () => 15,
        maxCost: lvl => 1 + lvl * 10 + 50,
        _isCompatible: other => other !== Enchantments.FORTUNE,
    });
    Enchantments.UNBREAKING = register('unbreaking', 'uncommon', 'breakable', {
        maxLevel: 3,
        minCost: lvl => 5 + (lvl - 1) * 8,
        maxCost: lvl => 1 + lvl * 10 + 50,
        _canEnchant: (item, next) => next() && !item.tag.getBoolean('Unbreakable'),
    });
    Enchantments.FORTUNE = register('fortune', 'rare', 'digger', {
        maxLevel: 3,
        minCost: lvl => 15 + (lvl - 1) * 9,
        maxCost: lvl => 1 + lvl * 10 + 50,
        _isCompatible: other => other !== Enchantments.SILK_TOUCH,
    });
    Enchantments.POWER = register('power', 'common', 'bow', {
        maxLevel: 5,
        minCost: lvl => 1 + (lvl - 1) * 10,
        maxCost: lvl => 1 + (lvl - 1) * 10 + 15,
    });
    Enchantments.PUNCH = register('punch', 'rare', 'bow', {
        maxLevel: 2,
        minCost: lvl => 12 + (lvl - 1) * 20,
        maxCost: lvl => 12 + (lvl - 1) * 20 + 25,
    });
    Enchantments.FLAME = register('flame', 'rare', 'bow', {
        minCost: () => 20,
        maxCost: () => 50,
    });
    Enchantments.INFINITY = register('infinity', 'very_rare', 'bow', {
        minCost: () => 20,
        maxCost: () => 50,
        _isCompatible: other => other !== Enchantments.MENDING,
    });
    Enchantments.LUCK_OF_THE_SEA = register('luck_of_the_sea', 'rare', 'fishing_rod', {
        maxLevel: 3,
        minCost: lvl => 15 + (lvl - 1) * 9,
        maxCost: lvl => 1 + lvl * 10 + 50,
        _isCompatible: other => other !== Enchantments.SILK_TOUCH,
    });
    Enchantments.LURE = register('lure', 'rare', 'fishing_rod', {
        maxLevel: 3,
        minCost: lvl => 15 + (lvl - 1) * 9,
        maxCost: lvl => 1 + lvl * 10 + 50,
    });
    Enchantments.LOYALTY = register('loyalty', 'uncommon', 'trident', {
        maxLevel: 3,
        minCost: lvl => 5 + lvl * 7,
        maxCost: () => 50,
    });
    Enchantments.IMPALING = register('impaling', 'rare', 'trident', {
        maxLevel: 5,
        minCost: lvl => 1 + (lvl - 1) * 8,
        maxCost: lvl => 1 + (lvl - 1) * 8 + 20,
    });
    Enchantments.RIPTIDE = register('riptide', 'rare', 'trident', {
        maxLevel: 3,
        minCost: lvl => 5 + lvl * 7,
        maxCost: () => 50,
        _isCompatible: other => other !== Enchantments.RIPTIDE && other !== Enchantments.CHANNELING,
    });
    Enchantments.CHANNELING = register('channeling', 'very_rare', 'trident', {
        minCost: () => 25,
        maxCost: () => 50,
    });
    Enchantments.MULTISHOT = register('multishot', 'rare', 'crossbow', {
        minCost: () => 20,
        maxCost: () => 50,
        _isCompatible: other => other !== Enchantments.PIERCING,
    });
    Enchantments.QUICK_CHARGE = register('quick_charge', 'uncommon', 'crossbow', {
        maxLevel: 3,
        minCost: lvl => 12 + (lvl - 1) * 20,
        maxCost: () => 50,
    });
    Enchantments.PIERCING = register('piercing', 'common', 'crossbow', {
        maxLevel: 4,
        minCost: lvl => 1 + (lvl - 1) * 10,
        maxCost: () => 50,
        _isCompatible: other => other !== Enchantments.MULTISHOT,
    });
    Enchantments.MENDING = register('mending', 'rare', 'breakable', {
        isTreasure: true,
        minCost: lvl => lvl * 25,
        maxCost: lvl => lvl * 25 + 50,
    });
    Enchantments.VANISHING_CURSE = register('vanishing_curse', 'very_rare', 'vanishable', {
        isTreasure: true,
        isCurse: true,
        minCost: () => 25,
        maxCost: () => 50,
    });
    const PROTECTION_ENCHANTS = new Set([Enchantments.PROTECTION, Enchantments.FIRE_PROTECTION, Enchantments.BLAST_PROTECTION, Enchantments.PROJECTILE_PROTECTION]);
    const DAMAGE_ENCHANTS = new Set([Enchantments.SHARPNESS, Enchantments.SMITE, Enchantments.BANE_OF_ARTHROPODS]);
})(Enchantments || (Enchantments = {}));
const ENCHANTMENT_CATEGORIES = new Map(Object.entries({
    armor: item => item.armor !== undefined,
    armor_feet: item => item.armor?.slot === 'feet',
    armor_legs: item => item.armor?.slot === 'legs',
    armor_chest: item => item.armor?.slot === 'chest',
    armor_head: item => item.armor?.slot === 'head',
    weapon: item => item.tiered?.isWeapon === true,
    digger: item => item.tiered?.isDigger === true,
    fishing_rod: item => item.id.path === 'fishing_rod',
    trident: item => item.id.path === 'trident',
    breakable: item => item.durability !== undefined,
    bow: item => item.id.path === 'bow',
    wearable: item => item.wearable === true,
    crossbow: item => item.id.path === 'crossbow',
    vanishable: item => item.vanishable === true,
}));
//# sourceMappingURL=Enchantment.js.map