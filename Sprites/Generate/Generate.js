/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Costume,
  Sound,
} from "../../cdn.js";
import Utils from "../../Utilities/utils.js";
import { Chunk, ChunkPos, DensityFunction, Identifier, NoiseChunkGenerator, NoiseGeneratorSettings, NoiseRouter, NoiseSettings, RandomState, WorldgenRegistries } from '../../Libraries/Deepslate/index.js'
import md5 from "../../Libraries/md5/md5.js"
export default class Generate extends Sprite {
  constructor(...args) {
    super(...args);
    Utils.log("log", "[Generate] Loading Costumes")
    this.costumes = [
      new Costume("costume3", "./Sprites/Generate/costumes/costume3.svg", {
        x: 0,
        y: 0,
      }),
    ];
    Utils.log("log", "[Generate] Loading Sounds")
    this.sounds = [new Sound("Meow", "./Sprites/Generate/sounds/Meow.wav")];
    Utils.log("log", "[Generate] Loading Triggers")
    this.triggers = [
      new Trigger(Trigger.BROADCAST, { name: "Generate level" }, this.whenIReceiveGenerateLevel),
      new Trigger(Trigger.KEY_PRESSED, { key: "r" }, this.whenKeyRPressed),
      new Trigger(Trigger.KEY_PRESSED, { key: "l" }, this.whenKeyLPressed)
    ];
    this.vars.x = 0;
    this.vars.y = 0;
    this.vars.gridIndex = 1;
    this.vars.chunk = []
  }




  *fillGrid() {
    Utils.log("log", "Md5 Hash of \"hello\" is " + md5("hello"))

    this.stage.vars.gridWidth = 32 * 16
    Utils.log("log", this.stage.vars.maxColumn)
    for (let x = 0; x < 1; x++) { // Adjust the range as needed

      const chunk = getChunk(x); // Example logic for different x values
      this.stage.vars.world = this.stage.vars.world.concat(chunk);
      this.stage.vars.maxColumn++

    }
    Utils.log("log", "Max Column: " + this.stage.vars.maxColumn)

    const flattenedData = this.stage.vars.world

    this.stage.vars.grid = []


    this.stage.vars.lightLevels = [];


  }






  *whenIReceiveGenerateLevel() {
    Utils.log("log", "[Generate] Generating Level")
    this.stage.vars.gridWidth = 16;
    this.stage.vars.gridHeight = 384
    
    Utils.log("log", "[Generate] Filling Grid")
    yield* this.fillGrid();
    this.stage.vars.cameraX = 240 + this.toNumber(this.stage.vars.tileSize);
    Utils.log("log", "[Generate] Cleaning up Generated Terrain Variables")

  }
  *whenKeyRPressed() {

    yield* this.append(this.stage.vars.maxColumn)
    this.stage.vars.maxColumn++
    this.stage.vars.gridWidth = this.stage.vars.gridWidth + 16

  }
  *whenKeyLPressed() {
    yield* this.prepend(this.stage.vars.minColumn - 1)
    this.stage.vars.minColumn--
    this.stage.vars.gridWidth = this.stage.vars.gridWidth + 16
    yield* this.sprites["Player"].offsetleft()
  }

  *prepend(x) {
    const chunk = getChunk(x);
    this.stage.vars.world = chunk.concat(this.stage.vars.world);
  }
  *append(x) {
    const chunk = getChunk(x);
    this.stage.vars.world = this.stage.vars.world.concat(chunk);
  }
}
function getChunk(x) {
  const fooNoise = WorldgenRegistries.NOISE.register(Identifier.parse('test:foo'), { firstOctave: -5, amplitudes: [0, 1, 1] });
  const noiseSettings = NoiseSettings.create({ minY: -64, height: 384 });
  const simpleSettings = NoiseGeneratorSettings.create({
    seaLevel: 100,
    noise: noiseSettings,
   
    noiseRouter: NoiseRouter.create({
      
      finalDensity: new DensityFunction.Ap2('add',
        new DensityFunction.YClampedGradient(0, 256, 1, -1.5),
        new DensityFunction.Noise(0.1, 0.1, fooNoise)
      ),
    }),
  });
  const randomState = new RandomState(simpleSettings, BigInt(125));
  const generator = new NoiseChunkGenerator(null, simpleSettings);

  const z = 0; // Fixed z-coordinate for the slice
  const chunkPos = ChunkPos.create(x * 16 >> 4, z >> 4); // Horizontal chunk position along x-axis
  const chunk = new Chunk(simpleSettings.noise.minY, simpleSettings.noise.height, chunkPos);
  generator.fill(randomState, chunk);
  // 2D chunk data along x (16 blocks) and y (384 blocks) for fixed z=37
  const chunkData = Array.from({ length: simpleSettings.noise.height }, () => Array(16).fill(null));

  for (let y = 0; y < simpleSettings.noise.height; y++) {
    for (let localX = 0; localX < 16; localX++) {
      // Get the block state at the specific (localX, y, z % 16) in the chunk
      chunkData[y][localX] = chunk.getBlockState([localX, y, z % 16]).getName().path;
    }
  }

  const flattenedData = Utils.flattenVertically(chunkData);

  return flattenedData;
}



