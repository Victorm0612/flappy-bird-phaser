"use strict";

import { WIDTH, HEIGHT } from "./constants/constants.js";
import Scene from "./scenes/Scene.js";
import SceneEnd from "./scenes/SceneEnd.js";

var config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 }
    }
  },
  scene: [Scene, SceneEnd]
};

new Phaser.Game(config);
