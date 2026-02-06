import Phaser from 'phaser';

export default class DeathScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DeathScene' });
    }

    create() {
        // Fond noir
        this.add.rectangle(320, 180, 640, 360, 0x000000);

        // Texte "YOU DIED"
        this.add.text(320, 120, 'YOU DIED', {
            fontSize: '48px',
            color: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Texte "Tap to retry"
        const retryText = this.add.text(320, 220, 'TAP TO RETRY', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Tween clignotant
        this.tweens.add({
            targets: retryText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Tap pour recommencer
        this.input.once('pointerdown', () => {
            this.scene.start('BossFightScene');
        });
    }
}