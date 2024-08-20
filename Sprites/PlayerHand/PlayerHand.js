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
import {isLeftClickDown, isRightClickDown} from "../../Utilities/mouse.js"
import State from "../../state.js";

export default class PlayerHand extends Sprite {
  constructor(...args) {
    super(...args);
    Utils.log("log", "[PlayerHand] Loading Costumes")
    this.costumes = [
      new Costume("Hand", "./Sprites/PlayerHand/costumes/Hand.svg", {
        x: 0.06007437587183517,
        y: 3.0189802580485434,
      }),
    ];
    
    this.sounds = [];
    Utils.log("log", "[PlayerHand] Loading Triggers")
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

    this.vars.tileGridX = 1;
    this.vars.tileGridY = 139;
    this.vars.tileIndex = 396;
    this.vars.tile = 2;
    this.vars.costume = "Air";
    this.vars.tileid = 2;
    this.vars.blockname = "Air ";
    this.vars.blocktype = "Unbreakable";
    this.vars.blocksolidity = "N";
    
  }
  
  *whenIReceivePositionTiles() {
    if (!this.sprites["Player"].vars.stopExecution){
    this.goto(this.sprites["Player"].x, this.sprites["Player"].y);
    this.y += this.sprites["Block"].vars.Tilemovestep/4;
    this.moveAhead();
    this.size = this.sprites["Player"].size
    this.direction = this.radToScratch(
      Math.atan2(this.mouse.y - this.y, this.mouse.x - this.x)
    );
    yield* this.getTileAtXY(
      this.toNumber(this.stage.vars.cameraX) + this.mouse.x,
      this.toNumber(this.stage.vars.cameraY) + this.mouse.y
    );
    if (
      isLeftClickDown() &&
      !(
        this.toNumber(
          this.itemOf(this.stage.vars.world, this.vars.tileIndex - 1)
        ) === "bedrock"
      )
    ) {
      //this.stage.vars.world.splice(this.vars.tileIndex - 1, 1,"air");
      this.stage.vars.world[this.vars.tileIndex - 1] = "air"
    }
    if (isRightClickDown()
       && !(this.toNumber(this.itemOf(this.stage.vars.world, this.vars.tileIndex - 1)) === "bedrock")){
      this.stage.vars.world[this.vars.tileIndex-1] = "deepslate" 
    }
  }
}

  *whenIReceiveCloneLevelTiles() {
    this.visible = true;
    
  }

  *getTileAtXY(x, y) {
    
      let chunk = (this.stage.vars.world)
      this.vars.tileGridX = Math.floor(this.toNumber(x) / this.toNumber(this.sprites["Block"].vars.Tilemovestep));
      this.vars.tileGridY = Math.floor(this.toNumber(y) / this.toNumber(this.sprites["Block"].vars.Tilemovestep));
      this.vars.tileIndex = 1 + this.toNumber(this.vars.tileGridY) + this.toNumber(this.vars.tileGridX) * this.toNumber(this.stage.vars.gridHeight);

      try {
        this.vars.tile = this.itemOf(this.stage.vars.grid, this.vars.tileIndex - 1);

      this.vars.tile = this.itemOf(chunk, this.vars.tileIndex - 1);
      } catch (error) {
        throw new Error("A block at " + this.vars.tileIndex + " is Invalid, meaning it probably doesn't have a definition, or is outside the world.")
      }
      
      try {
        this.vars.costume = this.stage.vars.blockData[this.vars.tile].costume
      } catch (error) {
        throw new Error("This block: [" + (this.vars.tile || "invalid") + "] has no attributes, or it is outside the world.");

      }
      
   
      this.vars.tileid = this.stage.vars.blockData[this.vars.tile].id;
      this.vars.blockname = this.stage.vars.blockData[this.vars.tile].name;
      this.vars.blocktype = this.stage.vars.blockData[this.vars.tile].type;
      this.vars.blocksolidity = this.stage.vars.blockData[this.vars.tile].solidity;
    document.getElementById("selectedBlock").innerHTML = "Block: " + this.vars.blockname
    document.getElementById("selectedBlockSolidity").innerHTML = "Block Solidity: " + this.vars.blocksolidity
  }
}
