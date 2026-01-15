import Phaser from 'phaser';
import Player from '../entities/Player.js';

export default class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1Scene' });
    }

    preload() {
        // Charger le fond
        this.load.image('alley-bg', 'assets/backgrounds/alley-bg.png');

        // Charger les sprites
        this.load.spritesheet('amia', 'assets/amia.png', { frameWidth: 48, frameHeight: 64 });
        this.load.spritesheet('gia', 'assets/gia.png', { frameWidth: 45, frameHeight: 27 });
        this.load.spritesheet('minicat', 'assets/minicat.png', { frameWidth: 32, frameHeight: 32 });

        // Charger la tilemap
        this.load.tilemapTiledJSON('level1', 'assets/levels/level1.json');

        // Charger les tilesets
        this.load.image('tileset1', 'assets/tileset1.png');
        this.load.image('tileset2', 'assets/tileset2.png');
        this.load.image('tileset3', 'assets/tileset3.png');
    }

    create() {
        // Créer les animations si elles n'existent pas
        this.createAnimations();

        // Image de fond (parallax ou fixe)
        this.bg = this.add.image(0, 0, 'alley-bg').setOrigin(0, 0).setScrollFactor(0.3);

        // Créer la tilemap
        this.createTilemap();

        // Créer le joueur
        this.player = new Player(this, 100, 200);

        // Collision
        if (this.collisionLayer) {
            this.physics.add.collider(this.player, this.collisionLayer);
        }

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
            key: 'minicat-walk',
            frames: this.anims.generateFrameNumbers('minicat', { start: 3, end: 5 }),
            frameRate: 6,
            repeat: -1
        });
    }

    createTilemap() {
        this.map = this.make.tilemap({ key: 'level1' });

        const tileset1 = this.map.addTilesetImage('tileset1', 'tileset1');
        const tileset2 = this.map.addTilesetImage('tileset2', 'tileset2');
        const tileset3 = this.map.addTilesetImage('tileset3', 'tileset3');

        this.bgLayer = this.map.createLayer('bg', [tileset1, tileset2, tileset3], 0, 0);
        this.surfLayer = this.map.createLayer('surf', [tileset1, tileset2, tileset3], 0, 0);

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

    update(time, delta) {
        if (this.player) {
            this.player.update(time, delta);

            // Vérifier si le joueur atteint la fin
            if (this.checkLevelEnd && this.player.x > 1800) {
                this.checkLevelEnd = false;
                this.scene.stop('UIScene');
                this.scene.start('Level2Scene'); // Passer au niveau suivant
            }
        }
    }
}