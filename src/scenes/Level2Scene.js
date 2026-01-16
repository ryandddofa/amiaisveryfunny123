import Phaser from 'phaser';
import Player from '../entities/Player.js';
import MiniCat from '../entities/MiniCat.js';
import Gia from '../entities/Gia.js';

export default class Level2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2Scene' });
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
        this.load.tilemapTiledJSON('level2', 'assets/levels/level2.json');

        // Charger les tilesets
        this.load.image('tileset1', 'assets/tilesets/tileset1.png');
        this.load.image('tileset2', 'assets/tilesets/tileset2.png');
        this.load.image('tileset3', 'assets/tilesets/tileset3.png');
        this.load.image('tileset4', 'assets/tilesets/tileset4.png');
        this.load.image('tileset5', 'assets/tilesets/tileset5.png');
    }

    create() {
        // Créer les animations si elles n'existent pas
        this.createAnimations();

        // Image de fond (parallax ou fixe)
        //this.bg = this.add.image(0, 0, 'alley-bg').setOrigin(0, 0).setScrollFactor(0.3);

        // Créer la tilemap
        this.createTilemap();

        // Créer le joueur
        this.player = new Player(this, 100, 200);

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

        // Setup caméra
        const mapWidth = this.map.widthInPixels;
        const mapHeight = this.map.heightInPixels;
        this.cameras.main.setZoom(3.5);
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
        this.map = this.make.tilemap({ key: 'level2' });

        const tileset1 = this.map.addTilesetImage('tileset1', 'tileset1');
        const tileset2 = this.map.addTilesetImage('tileset2', 'tileset2');
        const tileset3 = this.map.addTilesetImage('tileset3', 'tileset3');
        const tileset4 = this.map.addTilesetImage('tileset4', 'tileset4');
        const tileset5 = this.map.addTilesetImage('tileset5', 'tileset5');

        this.bgLayer = this.map.createLayer('bg', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
        this.surfLayer = this.map.createLayer('surf', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
        this.surf2Layer = this.map.createLayer('surf2', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
        this.surf3Layer = this.map.createLayer('surf3', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
        this.top1Layer = this.map.createLayer('top1', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
        this.top2Layer = this.map.createLayer('top2', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);

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
        const minicat1 = new MiniCat(this, 250, 204, 0x4538ff); // Rouge
        const minicat2 = new MiniCat(this, 350, 204, 0xf838ff); // Cyan
        const minicat3 = new MiniCat(this, 750, 204, 0x9bff38); // Jaune

        this.minicats.add(minicat1);
        this.minicats.add(minicat2);
        this.minicats.add(minicat3);

        // Collision minicats avec le sol
        if (this.collisionLayer) {
            this.physics.add.collider(this.minicats, this.collisionLayer);
        }

        // Collision joueur avec minicats
        this.physics.add.overlap(this.player, this.minicats, this.handlePlayerEnemyCollision, null, this);
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
        this.player.setPosition(100, 200);
        this.player.setVelocity(0, 0);
    }

    update(time, delta) {
        if (this.player) {
            this.player.update(time, delta);

            // Vérifier si le joueur atteint la fin (map fait 640 de width)
            if (this.checkLevelEnd && this.player.x > 900) { // ← Change 1800 à 600
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
                        this.scene.start('Level3Scene');
                    }
                });
            }
        }
    }
}