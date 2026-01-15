import Phaser from 'phaser';
import Player from '../entities/Player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Charger tous les sprite sheets
        this.loadAllSprites();

        // Charger la tilemap et les tilesets
        this.loadTilemap();
    }

    loadAllSprites() {
        // Amia (joueur) - 48x64, character 16x32
        this.load.spritesheet('amia', 'assets/amia.png', {
            frameWidth: 48,
            frameHeight: 64
        });

        // Ryan - 48x64, character 16x32
        this.load.spritesheet('ryan', 'assets/ryan.png', {
            frameWidth: 48,
            frameHeight: 64
        });

        // Gia (chien) - 45x27
        this.load.spritesheet('gia', 'assets/gia.png', {
            frameWidth: 45,
            frameHeight: 27
        });

        // Mini cats (ennemis) - 32x32
        this.load.spritesheet('minicat', 'assets/minicat.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        // Funny (boss chat) - 57x56
        this.load.spritesheet('funny', 'assets/funny.png', {
            frameWidth: 57,
            frameHeight: 56
        });
    }

    loadTilemap() {
        // Charger la tilemap JSON
        this.load.tilemapTiledJSON('testlevel', 'assets/testlevel.json');

        // Charger les 3 tilesets - NOMS SIMPLIFIÉS
        this.load.image('tileset1', 'assets/tileset1.png');
        this.load.image('tileset2', 'assets/tileset2.png');
        this.load.image('tileset3', 'assets/tileset3.png');
    }

    create() {
        // Créer toutes les animations
        this.createAllAnimations();

        // Créer le niveau depuis Tiled
        this.createTiledLevel();

        // Créer le joueur
        this.player = new Player(this, 100, 500);

        // Collision joueur avec les collisions de la map
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

        // Lancer la scène UI
        this.scene.launch('UIScene');

        // Setup inputs
        this.registry.set('playerInputs', {
            left: false,
            right: false,
            jump: false
        });

        // TEST: Créer les autres personnages pour voir les animations
        this.createTestCharacters();
    }

    createTiledLevel() {
        // Créer la tilemap
        this.map = this.make.tilemap({ key: 'testlevel' });

        // Ajouter les tilesets - LES NOMS DOIVENT MATCHER avec le JSON
        const tileset1 = this.map.addTilesetImage('tileset1', 'tileset1');
        const tileset2 = this.map.addTilesetImage('tileset2', 'tileset2');
        const tileset3 = this.map.addTilesetImage('tileset3', 'tileset3');

        // Créer les layers
        this.bgLayer = this.map.createLayer('bg', [tileset1, tileset2, tileset3], 0, 0);
        this.surfLayer = this.map.createLayer('surf', [tileset1, tileset2, tileset3], 0, 0);

        // Layer de collision
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

                // Rendre visible pour debug
                rect.setStrokeStyle(2, 0xff0000, 0.5);
            });
        }
    }

    createAllAnimations() {
        if (this.anims.exists('amia-idle')) {
            console.log('Animations already exist, skipping creation');
            return;
        }

        // ===== AMIA ANIMATIONS (on utilise seulement les animations RIGHT et on flip) =====

        // Idle (frames 0-7)
        this.anims.create({
            key: 'amia-idle',
            frames: this.anims.generateFrameNumbers('amia', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });

        // Walk (frames 32-39) - utilise walk RIGHT
        this.anims.create({
            key: 'amia-walk',
            frames: this.anims.generateFrameNumbers('amia', { start: 32, end: 39 }),
            frameRate: 10,
            repeat: -1
        });

        // Jump (frames 40-47)
        this.anims.create({
            key: 'amia-jump',
            frames: this.anims.generateFrameNumbers('amia', { start: 40, end: 47 }),
            frameRate: 10,
            repeat: 0
        });

        // ===== GIA ANIMATIONS =====
        this.anims.create({
            key: 'gia-walk',
            frames: this.anims.generateFrameNumbers('gia', { start: 3, end: 5 }), // Walk right
            frameRate: 8,
            repeat: -1
        });

        // ===== MINICAT ANIMATIONS =====
        this.anims.create({
            key: 'minicat-walk',
            frames: this.anims.generateFrameNumbers('minicat', { start: 3, end: 5 }), // Walk right
            frameRate: 6,
            repeat: -1
        });

        // ===== RYAN ANIMATIONS =====
        this.anims.create({
            key: 'ryan-idle',
            frames: this.anims.generateFrameNumbers('ryan', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
    }

    createTestCharacters() {
        // Créer Gia pour tester l'animation
        const gia = this.add.sprite(300, 500, 'gia');
        gia.play('gia-walk');
        gia.setFlipX(false); // Ajuste selon besoin
        this.physics.add.existing(gia);
        if (this.collisionLayer) {
            this.physics.add.collider(gia, this.collisionLayer);
        }

        // Créer un minicat pour tester
        const minicat = this.add.sprite(500, 500, 'minicat');
        minicat.play('minicat-walk');
        minicat.setFlipX(true); // Pour qu'il marche à gauche
        this.physics.add.existing(minicat);
        if (this.collisionLayer) {
            this.physics.add.collider(minicat, this.collisionLayer);
        }

        // Créer Ryan pour tester
        const ryan = this.add.sprite(700, 500, 'ryan');
        ryan.play('ryan-idle');
        this.physics.add.existing(ryan);
        if (this.collisionLayer) {
            this.physics.add.collider(ryan, this.collisionLayer);
        }

        // Créer Funny pour tester (animation par tween)
        const funny = this.add.sprite(900, 400, 'funny', 0);
        this.physics.add.existing(funny);
        if (this.collisionLayer) {
            this.physics.add.collider(funny, this.collisionLayer);
        }

        // Tween pour cycler entre les 3 états de Funny
        let currentFrame = 0;
        this.tweens.add({
            targets: { value: 0 },
            value: 2,
            duration: 2000, // 2 secondes pour un cycle complet
            ease: 'Linear',
            repeat: -1,
            onUpdate: (tween) => {
                const newFrame = Math.floor(tween.getValue());
                if (newFrame !== currentFrame) {
                    currentFrame = newFrame;
                    funny.setFrame(newFrame);
                }
            }
        });

        // Ajoute aussi un effet de scale pour le rendre plus menaçant
        this.tweens.add({
            targets: funny,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    update(time, delta) {
        if (this.player) {
            this.player.update(time, delta);
        }
    }
}