import Phaser from 'phaser';
import VirtualJoystick from '../controls/VirtualJoystick.js';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    // Joystick virtuel (gauche de l'écran)
    this.joystick = new VirtualJoystick(this, 80, 280);

    // Bouton de saut (droite de l'écran)
    this.createJumpButton();
  }

  createJumpButton() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xff0000, 0.5);
    graphics.fillCircle(560, 280, 40);
    graphics.lineStyle(3, 0xffffff, 1);
    graphics.strokeCircle(560, 280, 40);

    // Texte sur le bouton
    this.add.text(560, 260, '↑', {
      fontSize: '68px',
      color: '#ffffff',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5);

    // Zone interactive
    const jumpZone = this.add.zone(560, 280, 80, 80).setInteractive();

    let jumpPointer = null;

    jumpZone.on('pointerdown', (pointer) => {
      if (!jumpPointer) { // ← Seulement si pas déjà pressé
        jumpPointer = pointer.id;
        const inputs = this.registry.get('playerInputs');
        inputs.jump = true;
        this.registry.set('playerInputs', inputs);
      }
    });

    jumpZone.on('pointerup', (pointer) => {
      if (jumpPointer === pointer.id) { // ← Vérifie l'ID
        jumpPointer = null;
        const inputs = this.registry.get('playerInputs');
        inputs.jump = false;
        this.registry.set('playerInputs', inputs);
      }
    });

    this.input.on('pointerup', (pointer) => { // ← Fallback global
      if (jumpPointer === pointer.id) {
        jumpPointer = null;
        const inputs = this.registry.get('playerInputs');
        inputs.jump = false;
        this.registry.set('playerInputs', inputs);
      }
    });
  }

  update() {
    if (this.joystick) {
      this.joystick.update();
    }
  }
}