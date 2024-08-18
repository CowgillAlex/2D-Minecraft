import { Identifier } from '../Identifier.js';
import { Registry } from '../Registry.js';
const registry = new Registry(Identifier.create('attribute'));
Registry.REGISTRY.register(registry.key, registry);
export var Attribute;
(function (Attribute) {
    Attribute.REGISTRY = registry;
})(Attribute || (Attribute = {}));
function register(id, defaultValue, minValue, maxValue) {
    const attribute = {
        id: Identifier.create(id),
        defaultValue,
        minValue,
        maxValue,
    };
    registry.register(attribute.id, attribute, true);
    return attribute;
}
export var Attributes;
(function (Attributes) {
    Attributes.MAX_HEALTH = register('generic.max_health', 20, 1, 1024);
    Attributes.FOLLOW_RANGE = register('generic.follow_range', 32, 0, 2048);
    Attributes.KNOCKBACK_RESISTANCE = register('generic.knockback_resistance', 0, 0, 1);
    Attributes.MOVEMENT_SPEED = register('generic.movement_speed', 0.7, 0, 1024);
    Attributes.FLYING_SPEED = register('generic.flying_speed', 0.4, 0, 1024);
    Attributes.ATTACK_DAMAGE = register('generic.attack_damage', 2, 0, 2048);
    Attributes.ATTACK_KNOCKBACK = register('generic.attack_knockback', 0, 0, 5);
    Attributes.ATTACK_SPEED = register('generic.attack_speed', 4, 0, 1024);
    Attributes.ARMOR = register('generic.armor', 0, 0, 30);
    Attributes.ARMOR_TOUGHNESS = register('generic.armor_toughness', 0, 0, 20);
    Attributes.LUCK = register('generic.luck', 0, -1024, 1024);
    Attributes.SPAWN_REINFORCEMENTS = register('zombie.spawn_reinforcements', 0, 0, 1);
    Attributes.JUMP_STRENGTH = register('generic.jump_strength', 0.7, 0, 2);
})(Attributes || (Attributes = {}));
//# sourceMappingURL=Attribute.js.map