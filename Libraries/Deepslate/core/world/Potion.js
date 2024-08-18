import { NbtCompound, NbtType } from '../../nbt/index.js';
import { intToRgb } from '../../util/index.js';
import { Identifier } from '../Identifier.js';
import { ItemStack } from '../ItemStack.js';
import { Registry } from '../Registry.js';
import { MobEffects } from './MobEffect.js';
import { MobEffectInstance } from './MobEffectInstance.js';
const registry = new Registry(Identifier.create('potion'));
Registry.REGISTRY.register(registry.key, registry);
export var Potion;
(function (Potion) {
    Potion.REGISTRY = registry;
    function fromNbt(potion) {
        const tag = potion instanceof ItemStack ? potion.tag : potion;
        const name = tag.getString('Potion');
        return registry.get(Identifier.parse(name)) ?? Potions.EMPTY;
    }
    Potion.fromNbt = fromNbt;
    function getAllEffects(arg) {
        const potion = (arg instanceof ItemStack || arg instanceof NbtCompound) ? fromNbt(arg) : arg;
        const result = [];
        result.push(...potion.effects);
        if (potion instanceof ItemStack || potion instanceof NbtCompound) {
            const tag = potion instanceof ItemStack ? potion.tag : potion;
            tag.getList('CustomPotionEffects', NbtType.Compound).forEach(e => {
                const effect = MobEffectInstance.fromNbt(e);
                if (effect !== undefined) {
                    result.push(effect);
                }
            });
        }
        return result;
    }
    Potion.getAllEffects = getAllEffects;
    function getAllAttributeModifiers(arg) {
        const potion = (arg instanceof ItemStack || arg instanceof NbtCompound) ? fromNbt(arg) : arg;
        return potion.effects.flatMap(e => Array.from(e.effect.modifiers.entries()));
    }
    Potion.getAllAttributeModifiers = getAllAttributeModifiers;
    function getColor(arg) {
        if (arg === Potions.EMPTY) {
            return intToRgb(16253176);
        }
        if (arg instanceof ItemStack || arg instanceof NbtCompound) {
            const tag = arg instanceof ItemStack ? arg.tag : arg;
            if (tag.hasNumber('CustomPotionColor')) {
                return intToRgb(tag.getNumber('CustomPotionColor'));
            }
        }
        const effects = getAllEffects(arg);
        return MobEffectInstance.getColor(effects);
    }
    Potion.getColor = getColor;
})(Potion || (Potion = {}));
function register(id, ...effects) {
    let name = id;
    if (name.startsWith('long_')) {
        name = name.slice('long_'.length);
    }
    if (name.startsWith('strong_')) {
        name = name.slice('strong_'.length);
    }
    const potion = {
        id: Identifier.create(id),
        name,
        effects,
    };
    registry.register(potion.id, potion, true);
    return potion;
}
export var Potions;
(function (Potions) {
    Potions.EMPTY = register('empty');
    Potions.WATER = register('water');
    Potions.MUNDANE = register('mundane');
    Potions.THICK = register('thick');
    Potions.AWKWARD = register('awkward');
    Potions.NIGHT_VISION = register('night_vision', MobEffectInstance.create(MobEffects.NIGHT_VISION, 3600));
    Potions.LONG_NIGHT_VISION = register('long_night_vision', MobEffectInstance.create(MobEffects.NIGHT_VISION, 9600));
    Potions.INVISIBILITY = register('invisibility', MobEffectInstance.create(MobEffects.INVISIBILITY, 3600));
    Potions.LONG_INVISIBILITY = register('long_invisibility', MobEffectInstance.create(MobEffects.INVISIBILITY, 9600));
    Potions.LEAPING = register('leaping', MobEffectInstance.create(MobEffects.JUMP_BOOST, 3600));
    Potions.LONG_LEAPING = register('long_leaping', MobEffectInstance.create(MobEffects.JUMP_BOOST, 9600));
    Potions.STRONG_LEAPING = register('strong_leaping', MobEffectInstance.create(MobEffects.JUMP_BOOST, 1800, 1));
    Potions.FIRE_RESISTANCE = register('fire_resistance', MobEffectInstance.create(MobEffects.FIRE_RESISTANCE, 3600));
    Potions.LONG_FIRE_RESISTANCE = register('long_fire_resistance', MobEffectInstance.create(MobEffects.FIRE_RESISTANCE, 9600));
    Potions.SWIFTNESS = register('swiftness', MobEffectInstance.create(MobEffects.SPEED, 3600));
    Potions.LONG_SWIFTNESS = register('long_swiftness', MobEffectInstance.create(MobEffects.SPEED, 9600));
    Potions.STRONG_SWIFTNESS = register('strong_swiftness', MobEffectInstance.create(MobEffects.SPEED, 1800, 1));
    Potions.SLOWNESS = register('slowness', MobEffectInstance.create(MobEffects.SLOWNESS, 1800));
    Potions.LONG_SLOWNESS = register('long_slowness', MobEffectInstance.create(MobEffects.SLOWNESS, 4800));
    Potions.STRONG_SLOWNESS = register('strong_slowness', MobEffectInstance.create(MobEffects.SLOWNESS, 400, 3));
    Potions.TURTLE_MASTER = register('turtle_master', MobEffectInstance.create(MobEffects.SLOWNESS, 400, 3), MobEffectInstance.create(MobEffects.RESISTANCE, 400, 2));
    Potions.LONG_TURTLE_MASTER = register('long_turtle_master', MobEffectInstance.create(MobEffects.SLOWNESS, 800, 3), MobEffectInstance.create(MobEffects.RESISTANCE, 800, 2));
    Potions.STRONG_TURTLE_MASTER = register('strong_turtle_master', MobEffectInstance.create(MobEffects.SLOWNESS, 400, 5), MobEffectInstance.create(MobEffects.RESISTANCE, 400, 3));
    Potions.WATER_BREATHING = register('water_breathing', MobEffectInstance.create(MobEffects.WATER_BREATHING, 3600));
    Potions.LONG_WATER_BREATHING = register('long_water_breathing', MobEffectInstance.create(MobEffects.WATER_BREATHING, 9600));
    Potions.HEALING = register('healing', MobEffectInstance.create(MobEffects.INSTANT_HEALTH, 1));
    Potions.STRONG_HEALING = register('strong_healing', MobEffectInstance.create(MobEffects.INSTANT_HEALTH, 1, 1));
    Potions.HARMING = register('harming', MobEffectInstance.create(MobEffects.INSTANT_DAMAGE, 1));
    Potions.STRONG_HARMING = register('strong_harming', MobEffectInstance.create(MobEffects.INSTANT_DAMAGE, 1, 1));
    Potions.POISON = register('poison', MobEffectInstance.create(MobEffects.POISON, 900));
    Potions.LONG_POISON = register('long_poison', MobEffectInstance.create(MobEffects.POISON, 1800));
    Potions.STRONG_POISON = register('strong_poison', MobEffectInstance.create(MobEffects.POISON, 432, 1));
    Potions.REGENERATION = register('regeneration', MobEffectInstance.create(MobEffects.REGENERATION, 900));
    Potions.LONG_REGENERATION = register('long_regeneration', MobEffectInstance.create(MobEffects.REGENERATION, 1800));
    Potions.STRONG_REGENERATION = register('strong_regeneration', MobEffectInstance.create(MobEffects.REGENERATION, 450, 1));
    Potions.STRENGTH = register('strength', MobEffectInstance.create(MobEffects.STRENGTH, 3600));
    Potions.LONG_STRENGTH = register('long_strength', MobEffectInstance.create(MobEffects.STRENGTH, 9600));
    Potions.STRONG_STRENGTH = register('strong_strength', MobEffectInstance.create(MobEffects.STRENGTH, 1800, 1));
    Potions.WEAKNESS = register('weakness', MobEffectInstance.create(MobEffects.WEAKNESS, 1800));
    Potions.LONG_WEAKNESS = register('long_weakness', MobEffectInstance.create(MobEffects.WEAKNESS, 4800));
    Potions.LUCK = register('luck', MobEffectInstance.create(MobEffects.LUCK, 6000));
    Potions.SLOW_FALLING = register('slow_falling', MobEffectInstance.create(MobEffects.SLOW_FALLING, 1800));
    Potions.LONG_SLOW_FALLING = register('long_slow_falling', MobEffectInstance.create(MobEffects.SLOW_FALLING, 4800));
})(Potions || (Potions = {}));
//# sourceMappingURL=Potion.js.map