import Phaser from 'phaser';

export default class Epilogue extends Phaser.Scene {
    constructor() {
        super({ key: 'Epilogue' });
    }

    create() {
        // Fond
        this.add.rectangle(320, 180, 640, 360, 0xffd4ed);

        // Titre
        this.add.text(320, 80, 'HAPPY VALENTINE\'S DAY!', {
            fontSize: '32px',
            color: '#ff1493',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Message
        this.add.text(320, 180, 'Amia saved Ryan!\nFunny is back to normal!\nAll thanks to... ramen?', {
            fontSize: '16px',
            color: '#2c2c2c',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);

        // Crédits
        this.add.text(320, 280, 'Made with ❤️ for Valentine\'s Day 2025', {
            fontSize: '14px',
            color: '#ff69b4',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Tap pour recommencer
        const restartText = this.add.text(320, 320, 'TAP TO PLAY AGAIN', {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold'
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