import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 360,
  height: 640,
  pixelArt: true,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create,
    update
  }
};

let player;

function preload() {
  // Example: this.load.image('player', 'assets/player.png');
}

function create() {
  // Example placeholder: simple graphics
  const graphics = this.add.graphics();
  graphics.fillStyle(0xffffff, 1);
  graphics.fillRect(160, 280, 40, 40);

  this.add.text(10, 10, 'Hello Phaser', { fontSize: '16px', color: '#ffffff' });
}

function update(time, delta) {
  // Game loop
}

new Phaser.Game(config);
