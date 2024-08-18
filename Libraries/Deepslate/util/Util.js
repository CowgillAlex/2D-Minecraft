export function lazy(getter) {
    let value = null;
    return () => {
        if (value == null) {
            value = getter();
        }
        return value;
    };
}
export function computeIfAbsent(map, key, getter) {
    const existing = map.get(key);
    if (existing !== undefined) {
        return existing;
    }
    const value = getter(key);
    map.set(key, value);
    return value;
}
export function mutateWithDefault(map, key, initialValue, mutator) {
    const existing = map.get(key);
    const value = existing ?? initialValue;
    mutator(value, key);
    map.set(key, value);
    return value;
}
export function intToRgb(n) {
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return [r / 255, g / 255, b / 255];
}
//# sourceMappingURL=Util.js.map