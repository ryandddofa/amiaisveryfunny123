import Phaser from 'phaser';

export default class Ending1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Ending1Scene' });
    }

    preload() {
        // Charger le fond
        this.load.image('mcdo-interior-bg', 'assets/backgrounds/mcdo-interior-bg.png');

        // Charger les sprites des personnages
        this.load.spritesheet('amia', 'assets/amia.png', { frameWidth: 48, frameHeight: 64 });
        this.load.spritesheet('ryan', 'assets/ryan.png', { frameWidth: 48, frameHeight: 64 });
        this.load.spritesheet('gia', 'assets/gia.png', { frameWidth: 45, frameHeight: 27 });
    }

    create() {
        // Fond
        this.add.image(320, 180, 'mcdo-interior-bg').setDisplaySize(640, 360);

        // Position des personnages
        const amia = this.add.sprite(200, 200, 'amia', 0).setScale(2);
        const ryan = this.add.sprite(320, 200, 'ryan', 0).setScale(2);
        const gia = this.add.sprite(440, 240, 'gia', 0).setScale(2);

        // Boîte de dialogue (en bas de l'écran)
        this.createDialogBox();

        // Séquence de dialogues
        this.dialogues = [
            { speaker: 'Amia', text: 'Ryan, this burger is amazing!' },
            { speaker: 'Ryan', text: 'I know right? Best McDonald\'s ever!' },
            { speaker: 'Gia', text: 'Woof woof! (Can I have fries?)' },
            { speaker: 'Amia', text: 'Of course Gia! Here you go~' }
        ];

        this.currentDialogueIndex = 0;
        this.showNextDialogue();

        // Clic pour avancer les dialogues
        this.input.on('pointerdown', () => {
            this.currentDialogueIndex++;
            if (this.currentDialogueIndex < this.dialogues.length) {
                this.showNextDialogue();
            } else {
                // Fin de la scène, passer à la suivante
                this.scene.start('Intro2Scene');
            }
        });
    }

    createDialogBox() {
        // Rectangle noir semi-transparent
        this.dialogBox = this.add.rectangle(320, 310, 600, 100, 0x000000, 0.8);

        // Nom du personnage
        this.speakerText = this.add.text(40, 270, '', {
            fontSize: '20px',
            color: '#ffff00',
            fontStyle: 'bold'
        });

        // Texte du dialogue
        this.dialogText = this.add.text(40, 295, '', {
            fontSize: '16px',
            color: '#ffffff',
            wordWrap: { width: 560 }
        });
    }

    showNextDialogue() {
        const dialogue = this.dialogues[this.currentDialogueIndex];
        this.speakerText.setText(dialogue.speaker + ':');
        this.dialogText.setText(dialogue.text);
    }
}