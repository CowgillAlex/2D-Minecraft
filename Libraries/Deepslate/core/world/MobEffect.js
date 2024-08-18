import { intToRgb } from '../../util/index.js';
import { Identifier } from '../Identifier.js';
import { Registry } from '../Registry.js';
import { Attributes } from './Attribute.js';
import { AttributeModifierOperation } from './AttributeModifier.js';
const registry = new Registry(Identifier.create('mob_effect'));
Registry.REGISTRY.register(registry.key, registry);
const idMap = new Map();
export var MobEffect;
(function (MobEffect) {
    MobEffect.REGISTRY = registry;
    function fromId(n) {
        return idMap.get(n);
    }
    MobEffect.fromId = fromId;
})(MobEffect || (MobEffect = {}));
function register(n, id, category, color, modifiers = new Map()) {
    const mobEffect = {
        index: n,
        id: Identifier.create(id),
        category,
        color: typeof color === 'number' ? intToRgb(color) : color,
        modifiers,
    };
    idMap.set(n, mobEffect);
    registry.register(mobEffect.id, mobEffect, true);
    return mobEffect;
}
export var MobEffects;
(function (MobEffects) {
    MobEffects.SPEED = register(1, 'speed', 'beneficial', 8171462, new Map([
        [Attributes.MOVEMENT_SPEED, { amount: 0.2, operation: AttributeModifierOperation.multiply_total }],
    ]));
    MobEffects.SLOWNESS = register(2, 'slowness', 'harmful', 5926017, new Map([
        [Attributes.MOVEMENT_SPEED, { amount: -0.15, operation: AttributeModifierOperation.multiply_total }],
    ]));
    MobEffects.HASTE = register(3, 'haste', 'beneficial', 14270531, new Map([
        [Attributes.ATTACK_SPEED, { amount: 0.1, operation: AttributeModifierOperation.multiply_total }],
    ]));
    MobEffects.MINING_FATIGUE = register(4, 'mining_fatigue', 'harmful', 4866583, new Map([
        [Attributes.ATTACK_SPEED, { amount: -0.1, operation: AttributeModifierOperation.multiply_total }],
    ]));
    MobEffects.STRENGTH = register(5, 'strength', 'beneficial', 9643043, new Map([
        [Attributes.ATTACK_DAMAGE, { amount: 3, operation: AttributeModifierOperation.addition }],
    ]));
    MobEffects.INSTANT_HEALTH = register(6, 'instant_health', 'beneficial', 16262179);
    MobEffects.INSTANT_DAMAGE = register(7, 'instant_damage', 'harmful', 4393481);
    MobEffects.JUMP_BOOST = register(8, 'jump_boost', 'beneficial', 2293580);
    MobEffects.NAUSEA = register(9, 'nausea', 'harmful', 5578058);
    MobEffects.REGENERATION = register(10, 'regeneration', 'beneficial', 13458603);
    MobEffects.RESISTANCE = register(11, 'resistance', 'beneficial', 10044730);
    MobEffects.FIRE_RESISTANCE = register(12, 'fire_resistance', 'beneficial', 14981690);
    MobEffects.WATER_BREATHING = register(13, 'water_breathing', 'beneficial', 3035801);
    MobEffects.INVISIBILITY = register(14, 'invisibility', 'beneficial', 8356754);
    MobEffects.BLINDNESS = register(15, 'blindness', 'harmful', 2039587);
    MobEffects.NIGHT_VISION = register(16, 'night_vision', 'beneficial', 2039713);
    MobEffects.HUNGER = register(17, 'hunger', 'harmful', 5797459);
    MobEffects.WEAKNESS = register(18, 'weakness', 'harmful', 4738376, new Map([
        [Attributes.ATTACK_DAMAGE, { amount: -4, operation: AttributeModifierOperation.addition }],
    ]));
    MobEffects.POISON = register(19, 'poison', 'harmful', 5149489);
    MobEffects.WITHER = register(20, 'wither', 'harmful', 3484199);
    MobEffects.HEALTH_BOOST = register(21, 'health_boost', 'beneficial', 16284963, new Map([
        [Attributes.MAX_HEALTH, { amount: 4, operation: AttributeModifierOperation.addition }],
    ]));
    MobEffects.ABSORPTION = register(22, 'absorption', 'beneficial', 2445989);
    MobEffects.SATURATION = register(23, 'saturation', 'beneficial', 16262179);
    MobEffects.GLOWING = register(24, 'glowing', 'neutral', 9740385);
    MobEffects.LEVITATION = register(25, 'levitation', 'harmful', 13565951);
    MobEffects.LUCK = register(26, 'luck', 'beneficial', 3381504, new Map([
        [Attributes.LUCK, { amount: 1, operation: AttributeModifierOperation.addition }],
    ]));
    MobEffects.UNLUCK = register(27, 'unluck', 'harmful', 12624973, new Map([
        [Attributes.LUCK, { amount: -1, operation: AttributeModifierOperation.addition }],
    ]));
    MobEffects.SLOW_FALLING = register(28, 'slow_falling', 'beneficial', 16773073);
    MobEffects.CONDUIT_POWER = register(29, 'conduit_power', 'beneficial', 1950417);
    MobEffects.DOLPHINS_GRACE = register(30, 'dolphins_grace', 'beneficial', 8954814);
    MobEffects.BAD_OMEN = register(31, 'bad_omen', 'neutral', 745784);
    MobEffects.HERO_OF_THE_VILLAGE = register(32, 'hero_of_the_village', 'beneficial', 4521796);
    MobEffects.DARKNESS = register(33, 'darkness', 'harmful', 2696993);
})(MobEffects || (MobEffects = {}));
//# sourceMappingURL=MobEffect.js.map