import { NbtCompound } from '../nbt/index.js';
import { Identifier } from './Identifier.js';
import { Item } from './world/Item.js';
export class ItemStack {
    id;
    count;
    tag;
    item;
    constructor(id, count, tag = new NbtCompound()) {
        this.id = id;
        this.count = count;
        this.tag = tag;
    }
    getItem() {
        if (this.item === undefined) {
            this.item = Item.get(this.id);
        }
        return this.item;
    }
    clone() {
        const tag = NbtCompound.fromJson(this.tag.toJson());
        return new ItemStack(this.id, this.count, tag);
    }
    is(other) {
        if (typeof other === 'string') {
            return this.id.equals(Identifier.parse(other));
        }
        if (other instanceof Identifier) {
            return this.id.equals(other);
        }
        return this.id.equals(other.id);
    }
    equals(other) {
        if (this === other) {
            return true;
        }
        if (!(other instanceof ItemStack)) {
            return false;
        }
        return this.id.equals(other.id)
            && this.count === other.count
            && this.tag.toString() == other.tag.toString();
    }
    toString() {
        return this.id.toString() + (this.tag.size > 0 ? this.tag.toString() : '') + (this.count > 1 ? ` ${this.count}` : '');
    }
}
//# sourceMappingURL=ItemStack.js.map