/* eslint-disable require-yield, eqeqeq */

import isKeyDown from "../../Utilities/keyboard.js";
import {
  Sprite,
  Trigger,
  Costume,
} from "../../cdn.js";
import Utils from "../../Utilities/utils.js";
const doc = document.getElementById("coordinatesX")
export default class Player extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("Steve-STAND", "./Sprites/Player/costumes/Steve-STAND.svg", {
        x: 8.769335501618002,
        y: 32.102860396633645,
      }),
      new Costume("Steve-Walk-1", "./Sprites/Player/costumes/Steve-Walk-1.svg", {
        x: 10.332480959569324,
        y: 32.102864420733624,
      }),
      new Costume("Steve-Walk-2", "./Sprites/Player/costumes/Steve-Walk-2.svg", {
        x: 10.615554262894904,
        y: 32.22786246893358,
      }),
      new Costume("Steve-Walk-3", "./Sprites/Player/costumes/Steve-Walk-3.svg", {
        x: 13.171628792226215,
        y: 32.10286246893358,
      }),
      new Costume("Steve-Walk-4", "./Sprites/Player/costumes/Steve-Walk-4.svg", {
        x: 10.61555162815435,
        y: 32.102868444833604,
      }),
      new Costume("Steve-Jump", "./Sprites/Player/costumes/Steve-Jump.svg", {
        x: 21.581752150008015,
        y: 32.10286246893358,
      }),
      new Costume("Steve-Crouch", "./Sprites/Player/costumes/Steve-Crouch.svg", {
        x: 5.167214999999999,
        y: 24.615229999999997,
      }),
      new Costume("costume1", "./Sprites/Player/costumes/costume1.svg", {
        x: 2.5,
        y: 2.5,
      }),
    ];

    this.sounds = [];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked),
      new Trigger(
        Trigger.BROADCAST,
        { name: "Move player" },
        this.whenIReceiveMovePlayer
      ),
      
    ];

    this.vars.x = 100;
    this.vars.y = 100;
    this.vars.speedX = 0;
    this.vars.speedY = 0;
    this.vars.tileGridX = 0;
    this.vars.tileGridY = 0;
    this.vars.tileIndex = 0;
    this.vars.tile = 2;
    this.vars.height = 30;
    this.vars.width = 20
    this.vars.solid = 10;
    this.vars.falling = 0;
    this.vars.costume = "Air";
    this.vars.tileid = 2;
    this.vars.blockname = "Air ";
    this.vars.blocktype = "Unbreakable";
    this.vars.blocksolidity = "N";
    this.vars.modX = 4;
    this.vars.modY = 30;
    this.vars.fixDx = 0;
    this.vars.fixDy = -2;
    this.lastPressTime = { right: 0, left: 0 };
    this.keyDown = { right: false, left: false };
    this.doublePressThreshold = 300; // Time in milliseconds to detect a double press
    this.keyPressHandled = { right: false, left: false }; // To handle single vs. double press
    this.doublePressActive = { right: false, left: false }; // To keep track of double press state
    
  }
 
  *whenGreenFlagClicked() {
    yield* this.broadcastAndWait("Generate level");
    yield* this.broadcastAndWait("Clone Level Tiles");
    yield* this.resetPlayer();
    yield* this.gameLoop();
  }

  *resetPlayer() {
    Utils.log("warn", "[Player] Resetting Player")
    this.size = 100 * (this.toNumber(this.sprites["Block"].vars.Tilescale) / 2);
    this.stage.vars.cameraX = (window.innerWidth);
    this.stage.vars.cameraY = (window.innerHeight);
    this.vars.x = 200;
    this.vars.y = this.sprites["Block"].vars.Tilemovestep * 128;

    this.vars.height = (this.sprites["Block"].vars.Tilemovestep) - 2; //because thats the players centre
    this.vars.width = this.vars.height/4
    //players actual height is height*2


  }

*updateDebug(){

  document.getElementById("coordinatesXY").innerHTML = "XY: " + ((0-Math.abs(this.stage.vars.minColumn)  )*16 + this.vars.tileGridX) + " / " + (this.vars.tileGridY - 64)
 
}
*offsetleft(){
  this.vars.x  = this.vars.x + (16 * 64)
  
}

  *moveCamera() {
    
    
    this.stage.vars.cameraX = this.vars.x + this.mouse.x / 4;
    this.stage.vars.cameraY +=
      (this.toNumber(this.vars.y) - this.toNumber(this.stage.vars.cameraY)) /
      4 +
      this.mouse.y / 5;
    if (this.stage.vars.cameraX < (window.innerWidth / 2)) {
      this.stage.vars.cameraX = (window.innerWidth / 2);
      yield* this.sprites["Generate"].whenKeyLPressed()
      
      
    }
    if (this.stage.vars.cameraY < (window.innerHeight / 2)) {
      this.stage.vars.cameraY = (window.innerHeight / 2);
    }
    if (this.stage.vars.cameraX > this.sprites["Block"].vars.Tilemovestep * ((this.stage.vars.gridWidth-22)  - (window.innerWidth / 2))) {
      this.stage.vars.cameraX = this.sprites["Block"].vars.Tilemovestep * ((this.stage.vars.gridWidth-22) - (window.innerWidth / 2));
     
    }
    if (this.stage.vars.cameraX > this.sprites["Block"].vars.Tilemovestep * ((this.stage.vars.gridWidth-32)  - (window.innerWidth / 2))) {
      
      yield* this.sprites["Generate"].whenKeyRPressed()
    }
  }

  *gameLoop() {
    while (true) {
      this.broadcast("Move player");
      this.broadcast("Position Tiles");
      yield* this.moveCamera();
      yield* this.updateDebug();
      yield;
    }
  }

  *whenIReceiveMovePlayer() {
    yield* this.handleKeysJump();
    yield* this.handleKeysLeftRight();
    yield* this.moveSpriteX();
    yield* this.moveSpriteY();
    yield* this.moveCamera();
    this.goto(this.toNumber(this.vars.x) - this.toNumber(this.stage.vars.cameraX), this.toNumber(this.vars.y) - this.toNumber(this.stage.vars.cameraY));
  }

  *getTileAtXY(x, y) {
    let chunk = (this.stage.vars.world)
    this.vars.tileGridX = Math.floor(this.toNumber(x) / this.toNumber(this.sprites["Block"].vars.Tilemovestep));
    this.vars.tileGridY = Math.floor(this.toNumber(y) / this.toNumber(this.sprites["Block"].vars.Tilemovestep));
    this.vars.tileIndex = 1 + this.toNumber(this.vars.tileGridY) + this.toNumber(this.vars.tileGridX) * this.toNumber(this.stage.vars.gridHeight);
    this.vars.tile = this.itemOf(this.stage.vars.grid, this.vars.tileIndex - 1);
    this.vars.tile = this.itemOf(chunk, this.vars.tileIndex - 1);

    this.vars.costume = this.itemOf(this.stage.vars.blockData, this.indexInArray(this.stage.vars.blockData, this.vars.tile) + 1 - 1);
 
    this.vars.tileid = this.itemOf(this.stage.vars.blockData, this.indexInArray(this.stage.vars.blockData, this.vars.tile));
    this.vars.blockname = this.itemOf(this.stage.vars.blockData, this.indexInArray(this.stage.vars.blockData, this.vars.tile) );
    this.vars.blocktype = this.itemOf(this.stage.vars.blockData, this.indexInArray(this.stage.vars.blockData, this.vars.tile) + 1 );
    this.vars.blocksolidity = this.letterOf(this.itemOf(this.stage.vars.blockData, this.indexInArray(this.stage.vars.blockData, this.vars.tile) -1), 0);
  }

  *fixCollisionAtPointXY(x, y) {
    this.warp(this.getTileAtXY)(x, y);
    if (this.toString(this.vars.blocksolidity) === "Y") {
      this.vars.solid = 10;
      this.vars.modX =
        this.toNumber(x) %
        this.toNumber(this.sprites["Block"].vars.Tilemovestep);
      this.vars.modY =
        this.toNumber(y) %
        this.toNumber(this.sprites["Block"].vars.Tilemovestep);
      if (this.compare(this.vars.fixDy, 0) < 0) {
        this.vars.y +=
          this.toNumber(this.sprites["Block"].vars.Tilemovestep) -
          this.toNumber(this.vars.modY);
      }
      if (this.compare(this.vars.fixDx, 0) < 0) {
        this.vars.x +=
          this.toNumber(this.sprites["Block"].vars.Tilemovestep) -
          this.toNumber(this.vars.modX);
      }
      if (this.compare(this.vars.fixDy, 0) > 0) {
        this.vars.y += -0.01 - this.toNumber(this.vars.modY);
      }
      if (this.compare(this.vars.fixDx, 0) > 0) {
        this.vars.x += -0.01 - this.toNumber(this.vars.modX);
      }
    }
  }

  *fixCollisionInDirectionDxDy(dx, dy) {
    this.vars.fixDx = dx;
    this.vars.fixDy = dy;
    this.vars.solid = "";
   
   this.warp(this.fixCollisionAtPointXY)(this.vars.x, this.vars.y)
   this.warp(this.fixCollisionAtPointXY)(this.vars.x, this.vars.y-this.vars.height)
   this.warp(this.fixCollisionAtPointXY)(this.vars.x, this.vars.y+this.vars.height)
   this.warp(this.fixCollisionAtPointXY)(this.vars.x-this.vars.width, this.vars.y-this.vars.height)
   this.warp(this.fixCollisionAtPointXY)(this.vars.x-this.vars.width, this.vars.y+this.vars.height)
   this.warp(this.fixCollisionAtPointXY)(this.vars.x+this.vars.width, this.vars.y-this.vars.height)
   this.warp(this.fixCollisionAtPointXY)(this.vars.x+this.vars.width, this.vars.y+this.vars.height)
  }

  *moveSpriteX() {
    this.vars.x += this.vars.speedX;
    this.warp(this.fixCollisionInDirectionDxDy)(this.vars.speedX, 0);
  }

  *handleKeysLeftRight() {
    const now = Date.now(); // Get the current time

    // Check for the right arrow or 'd' key
    if (isKeyDown("ArrowRight") || isKeyDown("KeyD")) {
      if (!this.keyDown.right) {
        this.keyDown.right = true;
        if (now - this.lastPressTime.right < this.doublePressThreshold) {
          if (!this.keyPressHandled.right) {
            
            this.doublePressActive.right = true; // Set double press state
            this.keyPressHandled.right = true; // Ensure double press is handled only once
          }
        } else {
          this.keyPressHandled.right = false; // Reset if not a double press
        }
        this.lastPressTime.right = now; // Update last press time
      }
    } else {
      this.keyDown.right = false; // Key is released
      this.doublePressActive.right = false; // Reset double press state on key release
    }

    // Check for the left arrow or 'a' key
    if (isKeyDown("ArrowLeft") || isKeyDown("KeyA")) {
      if (!this.keyDown.left) {
        this.keyDown.left = true;
        if (now - this.lastPressTime.left < this.doublePressThreshold) {
          if (!this.keyPressHandled.left) {
           
            this.doublePressActive.left = true; // Set double press state
            this.keyPressHandled.left = true; // Ensure double press is handled only once
          }
        } else {
          this.keyPressHandled.left = false; // Reset if not a double press
        }
        this.lastPressTime.left = now; // Update last press time
      }
    } else {
      this.keyDown.left = false; // Key is released
      this.doublePressActive.left = false; // Reset double press state on key release
    }

    // Calculate keyWalk based on the state of the keys
    this.stage.vars.keyWalk =
      (this.toNumber(isKeyDown("ArrowRight") || isKeyDown("KeyD")) -
        this.toNumber(isKeyDown("ArrowLeft") || isKeyDown("KeyA")));

    // Adjust speedX based on whether a double press was detected
    if (this.doublePressActive.right || this.doublePressActive.left) {
      this.vars.speedX =
        0.8 * this.vars.speedX + this.stage.vars.keyWalk * 2.25; // Double press detected
    } else {
      this.vars.speedX =
        0.8 * this.vars.speedX + this.stage.vars.keyWalk * 1.25; // Regular key press
    }
  }

  *handleKeysJump() {
    if (this.keyPressed("up arrow") || this.keyPressed("w")) {
      if (this.compare(this.vars.falling, 5) < 0) {
        this.vars.speedY = 14;
      }
    }
    this.vars.speedY -= 2;
    if (this.compare(this.vars.speedY, -12) < 0) {
      this.vars.speedY = -12;
    }
  }

  *moveSpriteY() {
    this.vars.y += this.toNumber(this.vars.speedY);
    this.vars.falling++;
    this.warp(this.fixCollisionInDirectionDxDy)(0, this.vars.speedY);
    if (this.compare(this.vars.solid, 0) > 0) {
      if (this.compare(this.vars.speedY, 0) < 0) {
        this.vars.falling = 0;
      }
      this.vars.speedY = 0;
    }
  }
  
  
}