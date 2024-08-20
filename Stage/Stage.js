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
    this.vars.seed = this.random(1, 16777216)
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
    this.vars.state = false
    
    this.vars.blockData = {
      "BIG": {
        id: 1,
        name: "Big",
        costume: "BIG",
        type: "Unbreakable",
        solidity: "N"
      },
      "air": {
        id: 2,
        name: "Air",
        costume: "air",
        type: "Unbreakable",
        solidity: "N"
      },
      "bedrock": {
        id: 3,
        name: "Bedrock",
        costume: "bedrock",
        type: "Unbreakable",
        solidity: "Y"
      },
      "deepslate": {
        id: 4,
        name: "Deepslate",
        costume: "deepslate",
        type: "Block",
        solidity: "Y"
      },
      "deepslate_coal_ore": {
        id: 5,
        name: "Deepslate Coal Ore",
        costume: "deepslate_coal_ore",
        type: "Block",
        solidity: "Y"
      },
      "deepslate_copper_ore": {
        id: 6,
        name: "Deepslate Copper Ore",
        costume: "deepslate_copper_ore",
        type: "Block",
        solidity: "Y"

      },
      "deepslate_diamond_ore": {
        id: 7,
        name: "Deepslate Diamond Ore", 
        costume: "deepslate_diamond_ore",
        type: "Block",
        solidity: "Y"
      },
      "deepslate_emerald_ore": {
        id: 8,
        name: "Deepslate Emerald Ore",
        costume: "deepslate_emerald_ore",
        type: "Block",
        solidity: "Y"

      },
      "deepslate_gold_ore": {
        id: 9,
        name: "Deepslate Gold Ore",
        costume: "deepslate_gold_ore",
        type: "Block",
        solidity: "Y"
      },
      "deepslate_iron_ore": {
        id: 10,
        name: "Deepslate Iron Ore",
        costume: "deepslate_iron_ore",
        type: "Block",
        solidity: "Y"
      },
      "deepslate_lapis_ore": {
        id: 11,
        name: "Deepslate Lapis Ore",
        costume: "deepslate_lapis_ore",
        type: "Block",
        solidity: "Y"
      },
      "deepslate_redstone_ore": {
        id: 12,
        name: "Deepslate Redstone Ore",
        costume: "deepslate_redstone_ore",
        type: "Block",
        solidity: "Y"
      },
      "grass_block_side": {
        id: 13,
        name: "Grass Block",
        costume: "grass_block_side",
        type: "Block",
        solidity: "Y"
      },
      "grass_block_snow": {
        id: 14,
        name: "Snowy Grass",
        costume: "grass_block_snow",
        type: "Block",
        solidity: "Y"
      },
      "gravel": {
        id: 15,
        name: "Gravel",
        costume: "gravel",
        type: "Block",
        solidity: "Y"
      },
      "sand":{
        id: 16,
        name: "Sand",
        costume: "sand",
        type: "Block",
        solidity: "Y"
      },
      "stone":{
        id: 17,
        name: "Stone",
        costume: "stone",
        type: "Block",
        solidity: "Y"
      },
      "dirt":{
        id: 18,
        name: "Dirt",
        costume: "dirt",
        type: "Block",
        solidity: "Y"
      },
      "diamond_ore":{
        id: 19,
        name: "Diamond Ore",
        costume: "diamond_ore",
        type: "Block",
        solidity: "Y"
      },
      "water":{
        id: 20,
        name: "Water",
        costume: "water",
        type: "Block",
        solidity: "N"

      }

    }
  }
}
