"use strict";

import { WIDTH, HEIGHT } from "../constants/constants.js";

var PipeUpClass = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,
  initialize: function PipeUpClass(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'pipeDown');
  }
});

var PipeDownClass = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,
  initialize: function PipeDownClass(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'pipeUp');
  }
});

export default class Scene extends Phaser.Scene {
  constructor() {
    super('init');
    this.posX = WIDTH;
    this.isInitialState = true;
    this.showText = true;
    this.score = 0;
    this.initialTextInterval = null;
  }

  preload() {
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

  create() {
    this.add.sprite(480, 320, 'background');
    this.player = this.physics.add.sprite(50, WIDTH / 3, 'bird');
    this.player.setScale(.08);
    this.player.body.allowGravity = false;
  
    // resize
  
    // music
    this.soundtrack = this.sound.add('soundtrack');
    if (!this.playing && !this.load.isLoading()) {
      this.playing = true;
      this.soundtrack.loop = true;
      this.soundtrack.play();
    }
  
    // sfx jump
    this.jumpSound = this.sound.add('jump');
    this.failSound = this.sound.add('fail');
    this.coinSound = this.sound.add('coin');
  
    this.pipeUp = this.physics.add.group({
      classType: PipeUpClass,
      runChildUpdate: true,
      allowGravity: false
    })
    this.pipeDown = this.physics.add.group({
      classType: PipeDownClass,
      runChildUpdate: true,
      allowGravity: false
    })
  
    this.physics.add.collider(this.player, this.pipeDown, () => this.hitColumn());
    this.physics.add.collider(this.player, this.pipeUp, () => this.hitColumn());
  
    this.createInitialText();
  }

  update(time) {
    // listen keyboard
    this.input.keyboard.on('keydown', (event) => {
      if (event.keyCode === 32) {
        this.startGame();
      }
    });
  
    // listen mouse
    this.input.on('pointerdown', () => {
      this.startGame();
    });
  
    // Move Pipes
    if (!this.isInitialState) {
      this.generateBuildings(time);
      this.watchPlayer();
    }
  }

  generateBuildings(time) {
    if (time % 6 === 0) {
      if (time % 9 === 0) {
        this.pipeU = this.pipeUp.get().setActive(true).setVisible(true).setPosition(this.posX + 100, 30).setScale(2, 2);
        this.pipeD = this.pipeDown.get().setActive(true).setVisible(true).setPosition(this.posX + 100, HEIGHT - 60).setScale(2, 2);
      }
      else {
        this.pipeU = this.pipeUp.get().setActive(true).setVisible(true).setPosition(this.posX + 100, 60).setScale(2, 2);
        this.pipeD = this.pipeDown.get().setActive(true).setVisible(true).setPosition(this.posX + 100, HEIGHT - 100).setScale(2, 2);
      }
      this.pipeUp.setVelocityX(-200);
      this.pipeDown.setVelocityX(-200);
      this.posX += 100;
    }
    const newScore = this.pipeUp.getChildren().reduce((acc, crtV) => crtV.getBounds().right < 0 ? acc + 1 : acc, 0);
    if (newScore !== this.score) {
      this.score = newScore;
      this.scoreText.setText(`SCORE: ${this.score}`);
      this.coinSound.play();
    }
  }
  
  watchPlayer() {
    if (this.player.getBounds().y > HEIGHT) {
      this.hitColumn();
    }
  }
  
  startGame() {
    if (this.isInitialState) {
      this.player.body.allowGravity = true;
      clearInterval(this.initialTextInterval);
      this.text.visible = false;
      this.showText = false;
      this.isInitialState = false;
    }
    this.jump();
  }
  
  createInitialText() {
    this.scoreText = this.add.text(30, 20, `SCORE: ${this.score}`, { font: '24px VT323, monospace' });
    this.text = this.add.text(30, 50, `Press spacebar to start`, { font: '24px VT323, monospace' });
  
    this.initialTextInterval = setInterval(() => {
      if (this.showText) {
        this.text.visible = false;
        this.showText = false;
      } else {
        this.text.visible = true;
        this.showText = true;
      }
    }, 300);
  }
  
  jump() {
    this.jumpSound.play();
    this.player.setVelocityY(-200);
  }
  
  hitColumn() {
    this.failSound.play();
    this.posX = WIDTH;
    this.isInitialState = true;
    this.showText = true;
    this.score = 0;
    this.registry.destroy(); // destroy registry
    this.events.off(); // disable all active events
    this.scene.start('SceneEnd');
  }  
}
