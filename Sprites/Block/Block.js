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
export default class Block extends Sprite {
  constructor(...args) {
    super(...args);
    Utils.log("log", "[Block] Loading Costumes")
    this.costumes = [
      new Costume("BIG", "./Sprites/Block/costumes/BIG.svg", { x: 241.16167023554593, y: 174.54681005164477, }),
      new Costume("Air", "./Sprites/Block/costumes/Air.png", { x: 16, y: 16 }),
      new Costume("bedrock", "./Sprites/Block/costumes/bedrock.png", { x: 16, y: 16 }),

      new Costume("deepslate", "./Sprites/Block/costumes/deepslate.png", { x: 16, y: 16, }),
      new Costume("deepslate_coal_ore", "./Sprites/Block/costumes/deepslate_coal_ore.png", { x: 16, y: 16 }),
      new Costume("deepslate_copper_ore", "./Sprites/Block/costumes/deepslate_copper_ore.png", { x: 16, y: 16 }),
      new Costume("deepslate_diamond_ore", "./Sprites/Block/costumes/deepslate_diamond_ore.png", { x: 16, y: 16 }),
      new Costume("deepslate_emerald_ore", "./Sprites/Block/costumes/deepslate_emerald_ore.png", { x: 16, y: 16 }),
      new Costume("deepslate_gold_ore", "./Sprites/Block/costumes/deepslate_gold_ore.png", { x: 16, y: 16 }),
      new Costume("deepslate_iron_ore", "./Sprites/Block/costumes/deepslate_iron_ore.png", { x: 16, y: 16 }),
      new Costume("deepslate_lapis_ore", "./Sprites/Block/costumes/deepslate_lapis_ore.png", { x: 16, y: 16 }),
      new Costume("deepslate_redstone_ore", "./Sprites/Block/costumes/deepslate_redstone_ore.png", { x: 16, y: 16 }),
      new Costume("grass_block_side", "./Sprites/Block/costumes/grass_block_side.png", { x: 16, y: 16 }),
      new Costume("grass_block_snow", "./Sprites/Block/costumes/grass_block_snow.png", { x: 16, y: 16 }),
      new Costume("gravel", "./Sprites/Block/costumes/gravel.png", { x: 16, y: 16 }),
      new Costume("sand", "./Sprites/Block/costumes/sand.png", { x: 16, y: 16 }),
      new Costume("stone", "./Sprites/Block/costumes/stone.png", { x: 16, y: 16 }),
      new Costume("dirt", "./Sprites/Block/costumes/dirt.png", { x: 16, y: 16 }),
      new Costume("diamond_ore", "./Sprites/Block/costumes/diamond_ore.png", { x: 16, y: 16 }),

    ];

    this.sounds = [];
    Utils.log("log", "[Block] Loading Triggers")
    this.triggers = [
      new Trigger(
        Trigger.BROADCAST,
        { name: "Position Tiles" },
        this.whenIReceivePositionTiles
      ),
      new Trigger(
        Trigger.BROADCAST,
        { name: "Clone Level Tiles" },
        this.whenIReceiveCloneLevelTiles
      ),
    ];

    this.vars.tileX = 528;
    this.vars.tileY = 4176;
    this.vars.tile = 0;
    this.vars.tileIndex = 1;
    this.vars.Tilescale = 2;
    this.vars.Tilespritesize = 16;
    this.vars.Tilemovestep = 64;
    this.vars.Tileloopcap = 208;
    this.vars.block = "air"
    Utils.log("log", JSON.stringify(this))
  }
  *indexToArrayLocation(tileIndex, columnHeight = 384) {
    // Calculate the x-coordinate (column) by integer division of tileIndex by the column height
    const x = Math.floor(tileIndex / columnHeight);

    // Calculate the y-coordinate (row) by finding the remainder of tileIndex divided by the column height
    const y = tileIndex % columnHeight;

    // Return the array location as [x, y]
    return [x, y];
  }
  *whenIReceivePositionTiles() {
    this.size = 65536;
    yield* this.loopTile(
      (this.vars.tileX) - (this.stage.vars.cameraX),
      (this.vars.tileY) - (this.stage.vars.cameraY)
    );
    this.goto(
      (this.vars.tileX) - (this.stage.vars.cameraX),
      (this.vars.tileY) - (this.stage.vars.cameraY)
    );
    this.size = (this.vars.Tilescale) * 100;
    this.costume = "Air";
    //this.stamp();
    //this.costume = this.itemOf(this.stage.vars.grid, this.vars.tileIndex - 1);
    //document.getElementById('tileIdx').innerHTML = this.vars.tileX +" TileX "+ this.stage.vars.grid[this.vars.tileX]
    //console.log(this.stage.vars.grid)

    let chunk = (this.stage.vars.world)
    //chunk.flat()

    //this.costume = chunk[this.vars.tileIndex]
    this.costume = this.itemOf(chunk, this.vars.tileIndex - 1);
    this.vars.tiled = this.itemOf(chunk, this.vars.tileIndex - 1);
    this.costume = this.itemOf(this.stage.vars.blockData, this.indexInArray(this.stage.vars.blockData, this.vars.tiled));

    //this.costume = chunk[this.vars.tileX][this.vars.tileY]
    //this.costume = this.stage.vars.grid[pos][pos2]
    //this.stamp();
  }

  *generateCloneGrid() {
    this.stage.vars.cameraX =
      (this.stage.vars.cloneCountX) *
      0.5 *
      (this.vars.Tilemovestep);
    this.stage.vars.cameraY =
      (this.stage.vars.cloneCountY) *
      0.5 *
      (this.vars.Tilemovestep);
    this.vars.Tilescale = 4;
    this.vars.Tilespritesize = 16;
    this.vars.Tilemovestep = (this.vars.Tilescale) * (this.vars.Tilespritesize);
    this.stage.vars.cloneCountX = Math.ceil(window.innerWidth / (this.vars.Tilemovestep)) + 1;
    this.stage.vars.cloneCountY = Math.ceil(window.innerHeight / (this.vars.Tilemovestep)) + 1;
    Utils.log("log", "[Block] Clones: " + this.stage.vars.cloneCountX * this.stage.vars.cloneCountY)
    Utils.log("log", "[Block] Clones X: " + this.stage.vars.cloneCountX)
    Utils.log("log", "[Block] Clones Y: " + this.stage.vars.cloneCountY)
    this.vars.tileX = (this.vars.Tilemovestep) * 0.5;
    this.vars.tileIndex = 1;
    this.visible = true;
    for (let i = 0; i < (this.stage.vars.cloneCountX); i++) {
      this.vars.tileY = (this.vars.Tilemovestep) * 0.5;
      for (let i = 0; i < (this.stage.vars.cloneCountY); i++) {
        this.createClone();
        this.vars.tileY += (this.vars.Tilemovestep);
        this.vars.tileIndex++;
      }
      this.vars.tileX += (this.vars.Tilemovestep);
      this.vars.tileIndex +=
        (this.stage.vars.gridHeight) -
        (this.stage.vars.cloneCountY);
    }
    this.vars.tileIndex = "";
    this.visible = false;
  }

  *loopTile(x, y) {
    this.vars.Tileloopcap =
      (this.stage.vars.cloneCountX) *
      ((this.vars.Tilemovestep) * 0.5);
    if (
      this.compare(this.vars.tileIndex, 0) < 0 &&
      this.compare(
        Math.abs((this.vars.tileIndex)),
        this.stage.vars.grid.length
      ) > 0
    ) {
      this.vars.tile = this.itemOf(
        this.stage.vars.grid,
        this.vars.tileIndex - 1
      );
    }
    if (this.compare(x, this.vars.Tileloopcap) > 0) {
      this.vars.tileX +=
        0 -
        (this.stage.vars.cloneCountX) *
        (this.vars.Tilemovestep);
      this.vars.tileIndex +=
        (0 - (this.stage.vars.cloneCountX)) *
        (this.stage.vars.gridHeight);
    }
    if (this.compare(0 - (x), this.vars.Tileloopcap) > 0) {
      this.vars.tileX +=
        (this.stage.vars.cloneCountX) *
        (this.vars.Tilemovestep);
      this.vars.tileIndex +=
        (this.stage.vars.cloneCountX) *
        (this.stage.vars.gridHeight);
    }
    this.vars.Tileloopcap =
      (this.stage.vars.cloneCountY) *
      ((this.vars.Tilemovestep) * 0.5);
    if (this.compare(y, this.vars.Tileloopcap) > 0) {
      this.vars.tileY +=
        0 -
        (this.stage.vars.cloneCountY) *
        (this.vars.Tilemovestep);
      this.vars.tileIndex += 0 - (this.stage.vars.cloneCountY);
    }
    if (this.compare(0 - (y), this.vars.Tileloopcap) > 0) {
      this.vars.tileY +=
        (this.stage.vars.cloneCountY) *
        (this.vars.Tilemovestep);
      this.vars.tileIndex += (this.stage.vars.cloneCountY);
    }
  }

  *whenIReceiveCloneLevelTiles() {
    yield* this.generateCloneGrid();
  }
}
