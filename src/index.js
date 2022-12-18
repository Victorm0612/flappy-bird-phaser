"use strict";

// Constants
const WIDTH = 800;
const HEIGHT = 600;

var config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 200 }
      }
  },
  scene: {
      preload: preload,
      create: create
  }
};

var game = new Phaser.Game(config);

function preload ()
{
  this.load.setBaseURL('http://localhost:5500/src/');

  this.load.image('sky', 'assets/img/background.png');
  this.load.image('logo', 'assets/sprites/phaser3-logo.png');
  this.load.image('red', 'assets/particles/red.png');
}

function create ()
{
  this.add.image(400, 300, 'sky');

  var particles = this.add.particles('red');

  var emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
  });

  var logo = this.physics.add.image(400, 100, 'logo');

  logo.setVelocity(100, 200);
  logo.setBounce(1, 1);
  logo.setCollideWorldBounds(true);

  emitter.startFollow(logo);
}
