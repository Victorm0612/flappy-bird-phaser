export default class SceneEnd extends Phaser.Scene {
  constructor() {
    super('SceneEnd');
  }

  preload() {
    this.load.setBaseURL('http://localhost:5500/src/');
    this.load.image('bgEnd', 'assets/img/background_end.jpg');
  }

  create() {
    this.add.sprite(480, 320, 'bgEnd').setScale(.7);
    this.input.on('pointerdown', () => this.restart());
  }

  restart() {
    this.scene.start('init');
  }
}
