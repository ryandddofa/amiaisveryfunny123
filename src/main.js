import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene.js';
import Intro1Scene from './scenes/Intro1Scene.js';
import Intro2Scene from './scenes/Intro2Scene.js';
import Level1Scene from './scenes/Level1Scene.js';
import Level2Scene from './scenes/Level2Scene.js';
import Level3Scene from './scenes/Level3Scene.js';
import Level4Scene from './scenes/Level4Scene.js';
import Scene7 from './scenes/Scene7.js';
import BossFightScene from './scenes/BossFightScene.js';
import Epilogue from './scenes/Epilogue.js';
import DeathScene from './scenes/DeathScene.js';
import UIScene from './scenes/UIScene.js';
import GameScene from './scenes/GameScene.js'; // Garde pour test

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 640,
  height: 360,
  pixelArt: true,
  backgroundColor: '#000000',
  input: {
    activePointers: 3
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: true  // ← Change à false pour production
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [
    BossFightScene,
    MenuScene,      // Commence par le menu
    Intro1Scene,
    Intro2Scene,
    Level1Scene,
    Level2Scene,
    Level3Scene,
    Level4Scene,
    Scene7,

    DeathScene,
    Epilogue,
    UIScene,
    GameScene       // Pour test
  ]
};

new Phaser.Game(config);