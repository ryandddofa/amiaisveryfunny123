import Phaser from 'phaser';

export default class Intro2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Intro2Scene' });
    }

    preload() {
        // Charger le fond
        this.load.image('mcdo-interior-bg', 'assets/backgrounds/mcdo-interior-bg.png');

        // Charger les sprites des personnages
        this.load.spritesheet('amia', 'assets/amia.png', { frameWidth: 48, frameHeight: 64 });
        this.load.spritesheet('ryan', 'assets/ryan.png', { frameWidth: 48, frameHeight: 64 });
        this.load.spritesheet('gia', 'assets/gia.png', { frameWidth: 45, frameHeight: 27 });

        // Charger les portraits des personnages
        // Amia portraits
        this.load.image('a4', 'assets/portraits/a4.png');
        this.load.image('a1', 'assets/portraits/a1.png');
        this.load.image('a1', 'assets/portraits/a1.png');
        this.load.image('a3', 'assets/portraits/a3.png');

        // Ryan portraits
        this.load.image('ryan-portrait', 'assets/portraits/ryan-portrait.png');

        // Gia portraits
        this.load.image('gia-portrait', 'assets/portraits/gia-portrait.png');

        // Future character (F) portraits
        this.load.image('f1', 'assets/portraits/f1.png');
        this.load.image('f2', 'assets/portraits/f2.png');
        this.load.image('f3', 'assets/portraits/f3.png');
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

        // Séquence de dialogues avec couleurs
        this.dialogues = [
            { speaker: '', text: 'Outside the McDonald\'s...', color: '#ebebeb' },
            { speaker: '', text: '*KABOOM* *KABOOM*', color: '#ebebeb' },
            { speaker: 'Amia', text: 'What is happening oh my god!!', color: '#ff69b4', portrait: 'a1' },
            { speaker: 'Ryan', text: 'WHAT THE FUCK', color: '#4643ec', portrait: 'ryan-portrait' },
            { speaker: 'Gia', text: 'WOFO OWFOOOWF', color: '#ffff00', portrait: 'gia-portrait' },
            { speaker: '', text: 'You could hear screams and explosions from afar. The explosions seemed to get closer and closer.', color: '#ebebeb' },
            { speaker: 'Gia', text: 'WOOF WOOO FOW OFOOWOOF WOOF', color: '#ffff00', portrait: 'gia-portrait' },
            { speaker: 'Ryan', text: 'LOOK, FROM AFAR!!! IS THAT...', color: '#4643ec', portrait: 'ryan-portrait' },
            { speaker: 'Amia', text: 'HOLY SHIT', color: '#ff69b4', portrait: 'a2' },
            { speaker: 'Ryan', text: 'IS THAT FUCKING GODZILLA WHAT THE FUCK', color: '#4643ec', portrait: 'ryan-portrait' },
            { speaker: '', text: 'A giant cat started getting closer to them.', color: '#ebebeb' },
            { speaker: 'Funny', text: 'Meow.', color: '#f33b3b', portrait: 'f1' },
            { speaker: 'Amia', text: 'bro it\'s your cat', color: '#ff69b4', portrait: 'a1' },
            { speaker: 'Gia', text: 'WOOO FOW OFOOWOOF WOOF WOOF WOOO FOW OFOOWOOF WOOF ', color: '#ffff00', portrait: 'gia-portrait' },
            { speaker: 'Ryan', text: 'FUNNY????? WHAT IS FUNNY DOING THERE??', color: '#4643ec', portrait: 'ryan-portrait' },
            { speaker: 'Funny', text: 'Meow.', color: '#f33b3b', portrait: 'f1' },
            { speaker: 'Amia', text: 'MOST IMPORTANTLY WHY IS SHE THE SIZE OF DYLAN AND DESTROYING THE CITY???', color: '#ff69b4', portrait: 'a1' },
            { speaker: 'Gia', text: 'WOOF!!!!!', color: '#ffff00', portrait: 'gia-portrait' },
            { speaker: '', text: '*BOOM*', color: '#ebebeb' },
            { speaker: 'Amia', text: 'AHHHHHHHHHHHHHHH NOOOO RYANNN!!!!', color: '#ff69b4', portrait: 'a2' },
            { speaker: 'Ryan', text: 'YO FUNNY STOP IT TICKLES BRO', color: '#4643ec', portrait: 'ryan-portrait' },
            { speaker: '', text: '*KABOOOOM*', color: '#ebebeb' },
            { speaker: 'Gia', text: 'ong she fine', color: '#ffff00', portrait: 'gia-portrait' },
            { speaker: 'Amia', text: 'gia bro', color: '#ff69b4', portrait: 'a1' },
            { speaker: 'Ryan', text: 'HELP ME AHHHHHHHHHHHH', color: '#4643ec', portrait: 'ryan-portrait' },
            { speaker: 'Funny', text: 'Meow.', color: '#f33b3b', portrait: 'f1' },
            { speaker: 'Amia', text: 'RYAN NO COMEBACK!!!!', color: '#ff69b4', portrait: 'a1' },
            { speaker: 'Amia', text: 'I will save you Ryan...', color: '#ff69b4', portrait: 'a1' },
            { speaker: '', text: 'And so she follows Funny the giant destroying cat.', color: '#ebebeb' },
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
                this.scene.start('Level1Scene');
            }
        });
    }

    createDialogBox() {
        const boxWidth = 480;
        const boxHeight = 85;
        const boxX = 320;
        const boxY = 312;

        // Créer le fond avec des cercles (effet DDLC) - AVANT la boîte principale
        this.createCircleBackground(boxX, boxY, boxWidth, boxHeight);

        // Fond principal avec gradient (simulé avec des rectangles superposés)
        const mainBox = this.add.graphics();

        // Gradient rose pâle vers blanc
        mainBox.fillStyle(0xfff5f8, 1);
        mainBox.fillRoundedRect(boxX - boxWidth / 2, boxY - boxHeight / 2, boxWidth, boxHeight, 12);

        // Bordure avec ombre
        mainBox.lineStyle(3, 0xffb3d9, 1);
        mainBox.strokeRoundedRect(boxX - boxWidth / 2, boxY - boxHeight / 2, boxWidth, boxHeight, 12);

        // Bordure interne blanche
        mainBox.lineStyle(2, 0xffffff, 1);
        mainBox.strokeRoundedRect(boxX - boxWidth / 2 + 2, boxY - boxHeight / 2 + 2, boxWidth - 4, boxHeight - 4, 10);

        // Nom du personnage avec fond
        this.speakerBox = this.add.graphics();
        this.speakerBox.fillStyle(0xff69b4, 1);
        this.speakerBox.fillRoundedRect(boxX - boxWidth / 2 + 10, boxY - boxHeight / 2 - 18, 120, 28, 6);
        this.speakerBox.lineStyle(2, 0xffffff, 1);
        this.speakerBox.strokeRoundedRect(boxX - boxWidth / 2 + 10, boxY - boxHeight / 2 - 18, 120, 28, 6);

        this.speakerText = this.add.text(boxX - boxWidth / 2 + 70, boxY - boxHeight / 2 - 3, '', {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Texte du dialogue
        this.dialogText = this.add.text(boxX - boxWidth / 2 + 15, boxY - boxHeight / 2 + 18, '', {
            fontSize: '15px',
            color: '#2c2c2c',
            wordWrap: { width: boxWidth - 30 },
            fontFamily: 'Arial, sans-serif',
            lineSpacing: 3
        });

        // Portrait du personnage (initialement invisible) - à droite maintenant
        const portraitX = 490;
        const portraitY = boxY - 75;

        this.characterPortrait = this.add.image(portraitX, portraitY, 'amia-portrait')
            .setScale(0.25)
            .setVisible(false);

        // Cadre pour le portrait
        this.portraitFrame = this.add.graphics();
        this.portraitFrame.lineStyle(3, 0xffffff, 1);
        this.portraitFrame.strokeRoundedRect(portraitX - 35, portraitY - 35, 70, 70, 8);
        this.portraitFrame.lineStyle(2, 0xffb3d9, 1);
        this.portraitFrame.strokeRoundedRect(portraitX - 37, portraitY - 37, 74, 74, 9);
        this.portraitFrame.setVisible(false);

        this.speakerBox.setDepth(3);
        this.speakerText.setDepth(3);
        this.dialogText.setDepth(3);
        this.characterPortrait.setDepth(3);
        this.portraitFrame.setDepth(0);
    }

    createCircleBackground(x, y, width, height) {
        // Créer un fond avec des cercles décoratifs comme DDLC
        const graphics = this.add.graphics();

        // Cercles semi-transparents en arrière-plan
        const circles = [
            { x: x - width / 2 + 30, y: y - height / 2 + 15, radius: 12, color: 0xffc0e3, alpha: 0.4 },
            { x: x - width / 2 + 70, y: y + height / 2 - 15, radius: 15, color: 0xffd4ed, alpha: 0.4 },
            { x: x + width / 2 - 40, y: y - height / 2 + 20, radius: 14, color: 0xffe0f0, alpha: 0.4 },
            { x: x + width / 2 - 80, y: y + height / 2 - 12, radius: 10, color: 0xffc0e3, alpha: 0.4 },
            { x: x - width / 2 + 120, y: y, radius: 8, color: 0xffd4ed, alpha: 0.4 },
            { x: x + width / 2 - 120, y: y, radius: 11, color: 0xffe0f0, alpha: 0.4 }
        ];

        circles.forEach(circle => {
            graphics.fillStyle(circle.color, circle.alpha);
            graphics.fillCircle(circle.x, circle.y, circle.radius);
        });

        // Ajouter quelques petits cercles supplémentaires avec le for loop
        for (let i = 0; i < 12; i++) {
            const cx = x - width / 2 + Math.random() * width;
            const cy = y - height / 2 + Math.random() * height;
            const radius = 3 + Math.random() * 6;
            graphics.fillStyle(0xffc0e3, 0.25);
            graphics.fillCircle(cx, cy, radius);
        }

        // IMPORTANT: Mettre le depth à -1 pour que les cercles soient derrière la boîte
        graphics.setDepth(2);
    }

    showNextDialogue() {
        const dialogue = this.dialogues[this.currentDialogueIndex];

        // Mettre à jour le nom avec la couleur appropriée
        this.speakerText.setText(dialogue.speaker);
        this.speakerText.setColor('#ffffff');

        // Mettre à jour la couleur de la boîte du nom
        this.speakerBox.clear();
        const boxColor = this.getColorFromHex(dialogue.color);
        const boxWidth = 360;
        const boxHeight = 85;
        const boxX = 260;
        const boxY = 312;

        this.speakerBox.fillStyle(boxColor, 1);
        this.speakerBox.fillRoundedRect(boxX - boxWidth / 2 + 10, boxY - boxHeight / 2 - 18, 120, 28, 6);
        this.speakerBox.lineStyle(2, 0xffffff, 1);
        this.speakerBox.strokeRoundedRect(boxX - boxWidth / 2 + 10, boxY - boxHeight / 2 - 18, 120, 28, 6);

        // Mettre à jour le texte du dialogue
        this.dialogText.setText(dialogue.text);

        // Mettre à jour le portrait - utilise le portrait spécifié dans le dialogue
        this.characterPortrait.setTexture(dialogue.portrait);
        this.characterPortrait.setVisible(true);
        this.portraitFrame.setVisible(true);

        // Animation d'apparition du portrait
        this.characterPortrait.setScale(0.5);
        this.tweens.add({
            targets: this.characterPortrait,
            scale: 0.45,
            duration: 200,
            ease: 'Back.easeOut'
        });
    }

    getColorFromHex(hexString) {
        // Convertir #rrggbb en nombre hexadécimal
        return parseInt(hexString.replace('#', ''), 16);
    }
}