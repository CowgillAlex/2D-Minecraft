/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound,
} from "../../cdn.js";
import Utils from "../../Utilities/utils.js";

export default class Entity extends Sprite {
  constructor(...args) {
    super(...args);
    Utils.log("log", "[Entity] Loading Costumes")
    this.costumes = [
      new Costume("Zombie-look-1", "./Sprites/Entity/costumes/Zombie-look-1.svg", {
        x: 8.567451544999983,
        y: 32.26358048219393,
      }),
      new Costume("Zombie-walk-0", "./Sprites/Entity/costumes/Zombie-walk-0.svg", {
        x: 8.567444955708083,
        y: 32.24140784515467,
      }),
      new Costume("Zombie-walk-1", "./Sprites/Entity/costumes/Zombie-walk-1.svg", {
        x: 9.472017507087571,
        y: 32.241408251154695,
      }),
      new Costume("Zombie-walk-2", "./Sprites/Entity/costumes/Zombie-walk-2.svg", {
        x: 14.106360954068123,
        y: 32.24140784515467,
      }),
      new Costume("Zombie-walk-3", "./Sprites/Entity/costumes/Zombie-walk-3.svg", {
        x: 9.472017507087571,
        y: 32.241408251154695,
      }),
      new Costume("costume1", "./Sprites/Entity/costumes/costume1.svg", {
        x: 9.04592092449704,
        y: 10.62639808163641,
      }),
      new Costume("pig", "./Sprites/Entity/costumes/pig.png", { x: 64, y: 32 }),
      new Costume("sheep_fur", "./Sprites/Entity/costumes/sheep_fur.png", {
        x: 64,
        y: 32,
      }),
      new Costume("chicken", "./Sprites/Entity/costumes/chicken.png", { x: 64, y: 32 }),
      new Costume("villager", "./Sprites/Entity/costumes/villager.png", {
        x: 64,
        y: 64,
      }),
      new Costume("goat", "./Sprites/Entity/costumes/goat.png", { x: 64, y: 64 }),
    ];

    this.sounds = [];

    this.triggers = [];
  }
}
