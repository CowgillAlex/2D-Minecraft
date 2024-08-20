
import {
  Project,
  Sprite,
} from "./cdn.js";
import Utils from "./Utilities/utils.js"

import Stage from "./Stage/Stage.js";
import Entity from "./Sprites/Entity/Entity.js";
import PlayerHand from "./Sprites/PlayerHand/PlayerHand.js";
import Block from "./Sprites/Block/Block.js";
import Generate from "./Sprites/Generate/Generate.js";
import Player from "./Sprites/Player/Player.js";

import Chat from "./Sprites/Chat/Chat.js";
Utils.log("log", "[Base] Making Stage")
const stage = new Stage({ costumeNumber: 1 });
Utils.log("log", "[Base] Generating Sprites")
const sprites = {
  Entity: new Entity({
    x: -62,
    y: -115,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 8,
    size: 100,
    visible: false,
    layerOrder: 1,
  }),
  
  PlayerHand: new PlayerHand({
    x: -140,
    y: -133.99831429687038,
    direction: -8.512964269895306,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 1,
    size: 100,
    visible: true,
    layerOrder: 5,
  }),
  Block: new Block({
    x: 288,
    y: -93.99831429687038,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 2,
    size: 200,
    visible: false,
    layerOrder: 2,
  }),
  Generate: new Generate({
    x: -240,
    y: 0,
    direction: 0,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 1,
    size: 100,
    visible: false,
    layerOrder: 3,
  }),
  Player: new Player({
    x: -140,
    y: -143.99831429687038,
    direction: 90.26342087318655,
    rotationStyle: Sprite.RotationStyle.LEFT_RIGHT,
    costumeNumber: 1,
    size: 100,
    visible: true,
    layerOrder: 4,
  }),
  Chat: new Chat({
    x: -240,
    y: 0,
    direction: 0,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 1,
    size: 100,
    visible: false,
    layerOrder: 6,
  }),
};
Utils.log("log", "[Base] Constructing Project")
const project = new Project(stage, sprites, {
  frameRate: 60, //Most monitors are at this frame rate

});
Utils.log("log", "[Base] Setting framerate to 60 from 30")
export default project;
