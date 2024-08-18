/* eslint-disable require-yield, eqeqeq */

import {
  Stage as StageBase,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound,
} from "../cdn.js";
import Utils from "../Utilities/utils.js";
export default class Stage extends StageBase {
  constructor(...args) {
    super(...args);
    Utils.log("log", "[Stage] Loading Costumes")
    this.costumes = [
      new Costume("backdrop1", "../Stage/costumes/backdrop1.svg", {
        x: 240,
        y: 180,
      }),
    ];

    this.sounds = [];

    this.triggers = [];

    this.vars.cloneCountX = 16;
    this.vars.cloneCountY = 13;
    this.vars.cameraX = 240;
    this.vars.cameraY = 180;
    this.vars.gridWidth = 50;
    this.vars.gridHeight = 384;
    //this.vars.tileSize = 0;
    this.vars.keyWalk = 0;
    this.vars.minColumn = 0
    this.vars.maxColumn = 0
    this.vars.grid = []
    this.vars.world = []
    this.vars.biomes = [];
    this.vars.lightLevels = [];
    this.vars.blockData = [
      "BIG",
      1,
      "Big ",
      "Unbreakable",
      "N",
      "air",
      2,
      "Air ",
      "Unbreakable",
      "N",
      "bedrock",
      3,
      "Bedrock ",
      "Block",
      "Y",
      "deepslate",
      4,
      "Deepslate ",
      "Block",
      "Y",
      "deepslate_coal_ore",
      5,
      "Deepslate Coal Ore ",
      "Block",
      "Y",
      "deepslate_copper_ore",
      6,
      "Deepslate Copper Ore ",
      "Block",
      "Y",
      "deepslate_diamond_ore",
      7,
      "Deepslate Diamond Ore ",
      "Block",
      "Y",
      "deepslate_emerald_ore",
      8,
      "Deepslate Emerald Ore ",
      "Block",
      "Y",
      "deepslate_gold_ore",
      9,
      "Deepslate Gold Ore ",
      "Block",
      "Y",
      "deepslate_iron_ore",
      10,
      "Deepslate Iron Ore ",
      "Block",
      "Y",
      "deepslate_lapis_ore",
      11,
      "Deepslate Lapis Ore ",
      "Block",
      "Y",
      "deepslate_redstone_ore",
      12,
      "Deepslate Redstone Ore ",
      "Block",
      "Y",
      "grass_block_side",
      13,
      "Grass Block Side ",
      "Block",
      "Y",
      "grass_block_snow",
      14,
      "Grass Block Snow ",
      "Block",
      "Y",
      "gravel",
      15,
      "Gravel ",
      "Block",
      "Y",
      "sand",
      16,
      "Sand ",
      "Block",
      "Y",
      "stone",
      17,
      "Stone ",
      "Block",
      "Y",
      "dirt",
      18,
      "Dirt ",
      "Block",
      "Y",
      "diamond_ore",
      19,
      "Diamond Ore ",
      "Block",
      "Y",
      
    ];
  }
}
