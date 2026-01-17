import Phaser from 'phaser';
import Player from '../entities/Player.js';
import MiniCat from '../entities/MiniCat.js';
import Gia from '../entities/Gia.js';

export default class Level3Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3Scene' });
    }

    preload() {
        const wipeRect = this.add.rectangle(320, 180, 640, 360, 0x000000);
        wipeRect.setDepth(1000);

        this.tweens.add({
            targets: wipeRect,
            x: 960, // Hors écran à droite
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                wipeRect.destroy();
            }
        });

        // Charger le fond
        //this.load.image('alley-bg', 'assets/backgrounds/alley-bg.png');

        // Charger les sprites
        this.load.spritesheet('amia', 'assets/amia.png', { frameWidth: 48, frameHeight: 64 });
        this.load.spritesheet('gia', 'assets/gia.png', { frameWidth: 45, frameHeight: 27 });
        this.load.spritesheet('minicat', 'assets/minicat.png', { frameWidth: 32, frameHeight: 32 });

        // Charger la tilemap
        this.load.tilemapTiledJSON('level3', 'assets/levels/level3.json');

        // Charger les tilesets
        this.load.image('tileset1', 'assets/tilesets/tileset1.png');
        this.load.image('tileset2', 'assets/tilesets/tileset2.png');
        this.load.image('tileset3', 'assets/tilesets/tileset3.png');
        this.load.image('tileset4', 'assets/tilesets/tileset4.png');
        this.load.image('tileset5', 'assets/tilesets/tileset5.png');
        this.load.image('tileset6', 'assets/tilesets/tileset6.png');
    }

    create() {
        // Créer les animations si elles n'existent pas
        this.createAnimations();

        // Image de fond (parallax ou fixe)
        //this.bg = this.add.image(0, 0, 'alley-bg').setOrigin(0, 0).setScrollFactor(0.3);

        // Créer la tilemap
        this.createTilemap();

        // Créer le joueur
        this.player = new Player(this, 40, 200); // était 40 200

        this.gia = new Gia(this, this.player);
        // Collision de Gia avec le sol (optionnel)
        if (this.collisionLayer) {
            this.physics.add.collider(this.gia, this.collisionLayer);
        }

        // Collision
        if (this.collisionLayer) {
            this.physics.add.collider(this.player, this.collisionLayer);
        }

        this.createEnemies();

        // Créer la trigger zone
        this.triggerZone = this.add.rectangle(668, 100, 32, 32, 0x00ff00, 0); //metre a 0

        this.physics.add.existing(this.triggerZone);
        this.triggerZone.body.setAllowGravity(false);
        this.triggerZone.body.moves = false;

        // Variable pour tracker si le dialogue a été déclenché
        this.dialogueTriggered = false;
        this.dialogueActive = false;

        // Collision avec la zone
        this.physics.add.overlap(this.player, this.triggerZone, this.onTriggerEnter, null, this);

        // Setup caméra
        const mapWidth = this.map.widthInPixels;
        const mapHeight = this.map.heightInPixels;
        this.cameras.main.setZoom(2.25);
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
        this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

        // Lancer UI
        this.scene.launch('UIScene');

        // Setup inputs
        this.registry.set('playerInputs', {
            left: false,
            right: false,
            jump: false
        });

        // Détecter la fin du niveau (exemple: atteindre x > 1800)
        this.checkLevelEnd = true;
    }

    createAnimations() {
        if (this.anims.exists('amia-idle')) return;

        this.anims.create({
            key: 'amia-idle',
            frames: this.anims.generateFrameNumbers('amia', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'amia-walk',
            frames: this.anims.generateFrameNumbers('amia', { start: 32, end: 39 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'amia-jump',
            frames: this.anims.generateFrameNumbers('amia', { start: 40, end: 47 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'minicat-walk-left',
            frames: this.anims.generateFrameNumbers('minicat', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1
        });

        // Animation marche droite (row 1: frames 3, 4, 5)
        this.anims.create({
            key: 'minicat-walk-right',
            frames: this.anims.generateFrameNumbers('minicat', { start: 3, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'gia-walk-left',
            frames: this.anims.generateFrameNumbers('gia', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'gia-walk-right',
            frames: this.anims.generateFrameNumbers('gia', { start: 3, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
    }

    createTilemap() {
        this.map = this.make.tilemap({ key: 'level3' });

        const tileset1 = this.map.addTilesetImage('tileset1', 'tileset1');
        const tileset2 = this.map.addTilesetImage('tileset2', 'tileset2');
        const tileset3 = this.map.addTilesetImage('tileset3', 'tileset3');
        const tileset4 = this.map.addTilesetImage('tileset4', 'tileset4');
        const tileset5 = this.map.addTilesetImage('tileset5', 'tileset5');
        const tileset6 = this.map.addTilesetImage('tileset6', 'tileset6');

        this.bgLayer = this.map.createLayer('bg', [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);
        this.surfLayer = this.map.createLayer('surf', [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);
        this.surf2Layer = this.map.createLayer('surf2', [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);
        this.surf3Layer = this.map.createLayer('surf3', [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);
        this.top1Layer = this.map.createLayer('top1', [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);
        this.top2Layer = this.map.createLayer('top2', [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);

        this.collisionLayer = this.physics.add.staticGroup();

        const collisionObjects = this.map.getObjectLayer('collisions');
        if (collisionObjects) {
            collisionObjects.objects.forEach(obj => {
                const rect = this.add.rectangle(
                    obj.x + obj.width / 2,
                    obj.y + obj.height / 2,
                    obj.width,
                    obj.height
                );
                rect.setOrigin(0.5);
                this.physics.add.existing(rect, true);
                this.collisionLayer.add(rect);
            });
        }
    }

    createEnemies() {
        // Créer un groupe pour les minicats
        this.minicats = this.physics.add.group();

        // Créer 3 minicats avec différentes teintes et positions
        const minicat1 = new MiniCat(this, 60, 0, 0xffa07a); // Rouge
        const minicat2 = new MiniCat(this, 210, 0, 0x7affe7); // Cyan
        const minicat3 = new MiniCat(this, 600, 0, 0xbc63ff); // Jaune
        const minicat4 = new MiniCat(this, 900, 0, 0xdbff63); // Jaune

        this.minicats.add(minicat1);
        this.minicats.add(minicat2);
        this.minicats.add(minicat3);
        this.minicats.add(minicat4);

        // Collision minicats avec le sol
        if (this.collisionLayer) {
            this.physics.add.collider(this.minicats, this.collisionLayer);
        }

        // Collision joueur avec minicats
        this.physics.add.overlap(this.player, this.minicats, this.handlePlayerEnemyCollision, null, this);
    }

    onTriggerEnter() {
        if (!this.dialogueTriggered) {
            this.dialogueTriggered = true;
            this.showTriggerDialogue();
        }
    }

    showTriggerDialogue() {
        this.dialogueActive = true;

        // Pause le jeu
        this.physics.pause();

        // Créer la dialogue box
        const boxWidth = 180;
        const boxHeight = 35;
        const boxX = 320;
        const boxY = 220;

        const mainBox = this.add.graphics();
        mainBox.fillStyle(0xfff5f8, 1);
        mainBox.fillRoundedRect(boxX - boxWidth / 2, boxY - boxHeight / 2, boxWidth, boxHeight, 12);
        mainBox.lineStyle(3, 0xffb3d9, 1);
        mainBox.strokeRoundedRect(boxX - boxWidth / 2, boxY - boxHeight / 2, boxWidth, boxHeight, 12);
        mainBox.lineStyle(2, 0xffffff, 1);
        mainBox.strokeRoundedRect(boxX - boxWidth / 2 + 2, boxY - boxHeight / 2 + 2, boxWidth - 4, boxHeight - 4, 10);
        mainBox.setScrollFactor(0); // Fixe à l'écran
        mainBox.setDepth(1000);

        const dialogText = this.add.text(boxX, boxY, 'Why is there a Mint Milkshake in Ryan\'s bedroom?.. He hates mint...', {
            fontSize: '8px',
            color: '#2c2c2c',
            wordWrap: { width: boxWidth - 30 },
            resolution: 2,
            fontFamily: 'Arial, sans-serif',
            align: 'center',
            lineSpacing: 3
        }).setOrigin(0.5);
        dialogText.setScrollFactor(0);
        dialogText.setDepth(1001);

        // Stocker pour les détruire plus tard
        this.tempDialogBox = mainBox;
        this.tempDialogText = dialogText;

        // Click pour fermer
        this.input.once('pointerdown', () => {
            this.closeTriggerDialogue();
        });
    }

    closeTriggerDialogue() {
        this.dialogueActive = false;

        // Détruire les éléments du dialogue
        if (this.tempDialogBox) this.tempDialogBox.destroy();
        if (this.tempDialogText) this.tempDialogText.destroy();

        // Reprendre le jeu
        this.physics.resume();

        // Optionnel: détruire la zone trigger pour qu'elle ne se déclenche plus
        this.triggerZone.destroy();
    }

    handlePlayerEnemyCollision(player, enemy) {
        // Vérifier si le joueur touche par dessus
        if (player.body.touching.down && enemy.body.touching.up) {
            // Détruire l'ennemi
            enemy.destroy();

            // Petit rebond du joueur
            player.setVelocityY(-200);
        } else {
            // Touché sur le côté = respawn au début
            this.respawnPlayer();
        }
    }

    respawnPlayer() {
        // Téléporter le joueur au début
        this.player.setPosition(20, 200);
        this.player.setVelocity(0, 0);
    }

    update(time, delta) {
        if (this.player) {
            this.player.update(time, delta);

            if (this.player.y > 300) { this.respawnPlayer(); }

            // Vérifier si le joueur atteint la fin (map fait 640 de width)
            if (this.checkLevelEnd && this.player.x > 1220) { // ← Change 1800 à 600
                this.checkLevelEnd = false;
                this.scene.stop('UIScene');
                const wipeRect = this.add.rectangle(-640, 180, 640, 360, 0x000000);
                wipeRect.setDepth(1000); // Au-dessus de tout

                this.tweens.add({
                    targets: wipeRect,
                    x: 320, // Centre de l'écran
                    duration: 800,
                    ease: 'Power2',
                    onComplete: () => {
                        this.scene.start('Level4Scene');
                    }
                });
            }
        }
    }
}