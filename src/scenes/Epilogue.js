import Phaser from 'phaser';

export default class Epilogue extends Phaser.Scene {
    constructor() {
        super({ key: 'Epilogue' });
    }

    create() {
        // Fond
        this.add.rectangle(320, 180, 640, 360, 0xfef7ff);

        // Titre
        this.add.text(320, 80, 'HAPPY VALENTINE\'S DAY AMIA!!!', {
            fontSize: '32px',
            color: '#ff6cba',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 4,
            fontFamily: 'Arial, sans-serif',
            resolution: 2
        }).setOrigin(0.5);

        // Message
        this.add.text(320, 180, 'Amia saved Ryan!\nFunny is back to normal!\nWOOOHOHOHOHOHOHOH', {
            fontSize: '24px',
            color: '#2c2c2c',
            align: 'center',
            fontStyle: 'bold',
            lineSpacing: 5,
            fontFamily: 'Arial, sans-serif',
            resolution: 2
        }).setOrigin(0.5);

        // Tap pour recommencer
        const restartText = this.add.text(320, 320, 'TAP TO PLAY AGAIN', {
            fontSize: '16px',
            color: '#2d252b',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif',
            resolution: 2

        }).setOrigin(0.5);

        this.tweens.add({
            targets: restartText,
            alpha: 0.5,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        this.input.once('pointerdown', () => {
            this.scene.start('MenuScene'); // Retour au menu
        });
    }
}