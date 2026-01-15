import Phaser from 'phaser';

export default class VirtualJoystick {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.activePointer = null;

    // Base du joystick
    this.base = scene.add.graphics();
    this.base.fillStyle(0x888888, 0.5);
    this.base.fillCircle(x, y, 50);
    this.base.setDepth(100);

    // Stick du joystick
    this.stick = scene.add.graphics();
    this.stick.fillStyle(0xffffff, 0.8);
    this.stick.fillCircle(x, y, 25);
    this.stick.setDepth(101);

    this.stickX = x;
    this.stickY = y;

    // Variables de contrôle
    this.isPressed = false;
    this.radius = 50;
    this.deadZone = 10;

    // Zone interactive
    this.zone = scene.add.zone(x, y, 150, 150).setInteractive();

    this.zone.on('pointerdown', (pointer) => {
      if (!this.activePointer) { // ← Seulement si pas déjà actif
        this.isPressed = true;
        this.activePointer = pointer.id; // ← Stocke l'ID du pointeur
      }
    });

    scene.input.on('pointerup', (pointer) => {
      if (this.activePointer === pointer.id) { // ← Seulement si c'est le bon pointeur
        this.isPressed = false;
        this.activePointer = null;
        this.resetStick();
      }
    });

    scene.input.on('pointermove', (pointer) => {
      if (this.isPressed && this.activePointer === pointer.id) { // ← Vérifie l'ID
        this.updateStick(pointer.x, pointer.y);
      }
    });
  }

  updateStick(pointerX, pointerY) {
    const dx = pointerX - this.x;
    const dy = pointerY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.radius) {
      const angle = Math.atan2(dy, dx);
      this.stickX = this.x + Math.cos(angle) * this.radius;
      this.stickY = this.y + Math.sin(angle) * this.radius;
    } else {
      this.stickX = pointerX;
      this.stickY = pointerY;
    }

    this.stick.clear();
    this.stick.fillStyle(0xffffff, 0.8);
    this.stick.fillCircle(this.stickX, this.stickY, 25);
  }

  resetStick() {
    this.stickX = this.x;
    this.stickY = this.y;
    this.stick.clear();
    this.stick.fillStyle(0xffffff, 0.8);
    this.stick.fillCircle(this.x, this.y, 25);

    // Reset les inputs
    const inputs = this.scene.registry.get('playerInputs');
    inputs.left = false;
    inputs.right = false;
    this.scene.registry.set('playerInputs', inputs);
  }

  update() {
    if (!this.isPressed) return;

    const dx = this.stickX - this.x;
    
    // Mettre à jour les inputs dans le registry
    const inputs = this.scene.registry.get('playerInputs');

    if (Math.abs(dx) > this.deadZone) {
      if (dx < 0) {
        inputs.left = true;
        inputs.right = false;
      } else {
        inputs.left = false;
        inputs.right = true;
      }
    } else {
      inputs.left = false;
      inputs.right = false;
    }

    this.scene.registry.set('playerInputs', inputs);
  }

  destroy() {
    this.base.destroy();
    this.stick.destroy();
    this.zone.destroy();
  }
}