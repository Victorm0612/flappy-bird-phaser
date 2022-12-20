"use strict";

// Constants
const WIDTH = 960;
const HEIGHT = 640;

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
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var playing;
var player;
var bg;

// Pipes
var pipes;
var pipeU;
var pipeD;
var pipeUp;
var pipeDown;
var PipeUpClass = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,
  initialize: function PipeUpClass (scene){
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'pipeDown');          
  }
});

var PipeDownClass = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,
  initialize: function PipeDownClass (scene){
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'pipeUp');          
  }
});

// Score
let score = 0;

// Text variables
let isInitialState = true;
let showText = true;
let scoreText;
let text;
let initialTextInterval;

// Sfx
var soundtrack;
var jumpSound;
var failSound;
var coinSound;

function preload() {
  this.load.setBaseURL('http://localhost:5500/src/');
  this.load.image('background', 'assets/img/background.jpg');
  this.load.image('bird', 'assets/img/bird.png');
  this.load.image('pipeUp', 'assets/img/building_up.png');
  this.load.image('pipeDown', 'assets/img/building_down.png');

  // sfx
  this.load.audio('soundtrack', 'assets/music/Tech_Live.mp3');
  this.load.audio('jump', 'assets/sfx/jump.mp3');
  this.load.audio('fail', 'assets/sfx/fail.mp3');
  this.load.audio('coin', 'assets/sfx/coin.mp3');
}

function create() {
  this.add.sprite(480, 320, 'background');
  
  player = this.physics.add.sprite(50, WIDTH / 3, 'bird');
  player.setScale(.08);
  player.setCollideWorldBounds(true);
  player.body.allowGravity = false;

  // resize
  
  // music
  soundtrack = this.sound.add('soundtrack');
  if (!playing && !this.load.isLoading()) {
    playing = true;
    soundtrack.loop = true;
    soundtrack.play();
  }
  
  // sfx jump
  jumpSound = this.sound.add('jump');
  failSound = this.sound.add('fail');
  coinSound = this.sound.add('coin');
  
  pipeUp = this.physics.add.group({
    classType: PipeUpClass,
    runChildUpdate: true,
    allowGravity: false
  })
  pipeDown = this.physics.add.group({
    classType: PipeDownClass,
    runChildUpdate: true,
    allowGravity: false
  })

  this.physics.add.collider(player, pipeDown, () => hitColumn.call(this));
  this.physics.add.collider(player, pipeUp, () => hitColumn.call(this));

  createInitialText.call(this);
}

var posX = WIDTH;
function update(time) {
  // listen keyboard
  this.input.keyboard.on('keydown', (event) => {
    if (event.keyCode === 32) {
      startGame.call(this);
    }
  });

  // listen mouse
  this.input.on('pointerdown', () => {
    startGame.call(this);
  });

  // Move Pipes
  if (!isInitialState) {
    if (time % 6 === 0) {
      if (time % 9 === 0) {
        pipeU = pipeUp.get().setActive(true).setVisible(true).setPosition(posX + 100, 30).setScale(2,2);
        pipeD = pipeDown.get().setActive(true).setVisible(true).setPosition(posX + 100, HEIGHT - 60).setScale(2,2); 
      }
      else {
        pipeU = pipeUp.get().setActive(true).setVisible(true).setPosition(posX + 100, 60).setScale(2,2);
        pipeD = pipeDown.get().setActive(true).setVisible(true).setPosition(posX + 100, HEIGHT - 100).setScale(2,2);
      }
      pipeUp.setVelocityX(-200);
      pipeDown.setVelocityX(-200);
      posX += 100;
    }
    const newScore = pipeUp.getChildren().reduce((acc, crtV) => crtV.getBounds().right < 0 ? acc + 1 : acc, 0);
    if (newScore !== score) {
      score = newScore;
      scoreText.setText(`SCORE: ${score}`);
      coinSound.play();
    }
  }
}

function startGame() {
  if (isInitialState) {
    player.body.allowGravity = true;
    clearInterval(initialTextInterval);
    text.visible = false;
    showText = false;
    isInitialState = false;
  }  
  jump.call(this);
}

function createInitialText() {
  scoreText = this.add.text(30, 20, `SCORE: ${score}`, { font: '24px VT323, monospace' });
  text = this.add.text(30, 50, `Press spacebar to start`, { font: '24px VT323, monospace' });

  initialTextInterval = setInterval(() => {
    if (showText) {
      text.visible = false;
      showText = false;
    } else {
      text.visible = true;
      showText = true;
    }
  }, 300);
}

function jump() {
  jumpSound.play();
  player.setVelocityY(-200);
}

function hitColumn() {
  failSound.play();
  alert('Game Over');
  this.scene.stop();
  window.location.reload();
}

new Phaser.Game(config);
