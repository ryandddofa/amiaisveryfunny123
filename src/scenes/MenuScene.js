import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // Charger les images du menu
        this.load.image('menu-bg', 'assets/backgrounds/menu-bg.png');
        this.load.image('menu-logo', 'assets/backgrounds/menu-logo.png');
    }

    create() {
        // Fond
        const bg = this.add.image(320, 180, 'menu-bg').setDisplaySize(640, 360);
        bg.setAlpha(1);
        bg.setOrigin(0.5);

        let hue = 0;
        this.time.addEvent({
            delay: 38, // Mise à jour toutes les 50ms
            callback: () => {
                hue += 2; // Augmente la teinte
                if (hue >= 360) hue = 0; // Reset après un cycle complet

                // Convertir HSV en couleur pour setTint
                const color = Phaser.Display.Color.HSVToRGB(hue / 360, 1, 1);
                bg.setTint(color.color);
            },
            loop: true
        });

        // Logo centré
        const logo = this.add.image(320, 180, 'menu-logo');

        // Texte "Tap to start" avec tween d'opacité
        const startText = this.add.text(320, 280, 'tap to start playing cawliss', {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            resolution: 2,
        }).setOrigin(0.5);

        // Tween d'opacité
        this.tweens.add({
            targets: startText,
            alpha: 0.3,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: logo,
            y: "+=-10",
            angle: -1,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeIn'
        });

        // Détecter le tap/click
        this.input.once('pointerdown', () => {
            this.scene.start('Intro1Scene');
        });
    }
}