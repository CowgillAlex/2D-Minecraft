import { intToRgb } from '../../util/index.js';
import { MobEffect } from './MobEffect.js';
export var MobEffectInstance;
(function (MobEffectInstance) {
    function create(effect, duration = 0, amplifier = 0, ambient = false, visible = true, showIcon) {
        return {
            effect,
            duration,
            amplifier,
            ambient,
            visible,
            showIcon: showIcon ?? visible,
        };
    }
    MobEffectInstance.create = create;
    function fromNbt(tag) {
        const id = tag.getNumber('Id');
        const effect = MobEffect.fromId(id);
        if (effect === undefined)
            return undefined;
        const amplifier = tag.getNumber('Amplifier');
        const duration = tag.getNumber('Duration');
        const ambient = tag.getBoolean('Ambient');
        const visible = !tag.has('ShowParticles') || tag.getBoolean('ShowParticles');
        const showIcon = tag.has('ShowIcon') ? visible : tag.getBoolean('ShowIcon');
        return { effect, duration, amplifier, ambient, visible, showIcon };
    }
    MobEffectInstance.fromNbt = fromNbt;
    function getColor(effects) {
        let [r, g, b] = [0, 0, 0];
        let total = 0;
        for (const effect of effects) {
            const amplifier = effect.amplifier + 1;
            const color = effect.effect.color;
            if (color === undefined)
                continue;
            r += amplifier * color[0];
            g += amplifier * color[1];
            b += amplifier * color[2];
            total += amplifier;
        }
        if (total === 0) {
            return intToRgb(0);
        }
        r = r / total;
        g = g / total;
        b = b / total;
        return [r, g, b];
    }
    MobEffectInstance.getColor = getColor;
    function formatDuration(effect) {
        const ticks = Math.floor(effect.duration);
        let seconds = Math.floor(ticks / 20);
        let minutes = Math.floor(seconds / 60);
        seconds %= 60;
        const hours = Math.floor(minutes / 60);
        minutes %= 60;
        return `${hours > 0 ? `${hours}:` : ''}${minutes.toFixed().padStart(2, '0')}:${seconds.toFixed().padStart(2, '0')}`;
    }
    MobEffectInstance.formatDuration = formatDuration;
})(MobEffectInstance || (MobEffectInstance = {}));
//# sourceMappingURL=MobEffectInstance.js.map