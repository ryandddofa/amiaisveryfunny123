import Phaser from 'phaser';
import Player from '../entities/Player.js';

export default class BossFightScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BossFightScene' });
    }

    preload() {
        // Charger le fond
        this.load.image('alley-bg', 'assets/backgrounds/alley-bg.png');

        // Charger les sprites
        this.load.spritesheet('amia', 'assets/amia.png', { frameWidth: 48, frameHeight: 64 });
        this.load.spritesheet('funny', 'assets/funny.png', { frameWidth: 57, frameHeight: 56 });

        // Charger l'image d'explosion
        this.load.image('explosion', 'assets/explosion.png'); // ← AJOUTE cette image dans assets

        // Charger la tilemap
        this.load.tilemapTiledJSON('boss', 'assets/levels/boss.json');

        // Charger les tilesets
        this.load.image('tileset1', 'assets/tilesets/tileset1.png');
        this.load.image('tileset2', 'assets/tilesets/tileset2.png');
        this.load.image('tileset6', 'assets/tilesets/tileset6.png');
    }

    create() {
        // Créer les animations
        this.createAnimations();

        // Image de fond
        this.bg = this.add.image(0, 0, 'alley-bg').setOrigin(0, 0).setScrollFactor(0.3);

        // Créer la tilemap
        this.createTilemap();

        // Créer le joueur
        this.player = new Player(this, 0, 60);

        // Collision
        if (this.collisionLayer) {
            this.physics.add.collider(this.player, this.collisionLayer);
        }

        // Setup caméra
        const mapWidth = this.map.widthInPixels;
        const mapHeight = this.map.heightInPixels;
        this.cameras.main.setZoom(3);
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

        // ===== SETUP DU BOSS =====
        this.createBoss();
        this.createBossHealthBar();

        // Variables du boss
        this.bossHealth = 3;
        this.bossMaxHealth = 3;
        this.canHitBoss = true;
        this.lastHitTime = 0;
        this.hitCooldown = 3000; // 3 secondes en millisecondes

        // Timer pour les explosions (toutes les 5 secondes)
        this.time.addEvent({
            delay: 5000,
            callback: this.bossAttack,
            callbackScope: this,
            loop: true
        });

        // Groupe pour les explosions
        this.explosions = this.physics.add.group();
        this.physics.add.overlap(this.player, this.explosions, this.hitByExplosion, null, this);
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
    }

    createTilemap() {
        this.map = this.make.tilemap({ key: 'boss' });

        const tileset1 = this.map.addTilesetImage('tileset1', 'tileset1');
        const tileset2 = this.map.addTilesetImage('tileset2', 'tileset2');
        const tileset6 = this.map.addTilesetImage('tileset6', 'tileset6');

        this.bgLayer = this.map.createLayer('bg', [tileset1, tileset2, tileset6], 0, 0);
        this.top2Layer = this.map.createLayer('top2', [tileset1, tileset2, tileset6], 0, 0);

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

    createBoss() {
        // Funny centré (ajuste la position selon ta map)
        const centerX = this.map.widthInPixels / 2;
        this.funny = this.add.sprite(centerX, 105, 'funny', 2);
        this.funny.setScale(1); // Plus gros pour un boss
        this.physics.add.existing(this.funny);
        this.funny.body.setAllowGravity(false);
        this.funny.body.setImmovable(true);

        // Hitbox pour sauter dessus
        this.funny.body.setSize(43, 35);

        // Collision avec le joueur
        this.physics.add.overlap(this.player, this.funny, this.handleBossCollision, null, this);
    }

    createBossHealthBar() {
        // Coordonnées en ÉCRAN (setScrollFactor 0)
        const barWidth = 70;
        const barHeight = 5;
        const barX = 320; // ← Centre horizontal de l'écran (640/2)
        const barY = 140;  // ← Plus haut

        // Fond de la barre (noir)
        this.healthBarBg = this.add.rectangle(barX, barY, barWidth, barHeight, 0x000000);
        this.healthBarBg.setScrollFactor(0);
        this.healthBarBg.setDepth(1000);
        this.healthBarBg.setOrigin(0.5); // ← AJOUTE pour centrer

        // Barre de vie (rouge)
        this.healthBar = this.add.rectangle(barX, barY, barWidth - 1, barHeight - 1, 0xff0000);
        this.healthBar.setScrollFactor(0);
        this.healthBar.setDepth(1001);
        this.healthBar.setOrigin(0.5); // ← AJOUTE pour centrer

        // Texte "Funny"
        this.bossNameText = this.add.text(barX, barY - 12, 'Funny', { // ← Ajuste Y
            fontSize: '11px',
            color: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.bossNameText.setScrollFactor(0);
        this.bossNameText.setDepth(1002);
    }

    updateBossHealthBar() {
        // Mettre à jour la largeur de la barre
        const healthPercent = this.bossHealth / this.bossMaxHealth;
        const maxWidth = 66; // 200 - 4 (padding)
        this.healthBar.width = maxWidth * healthPercent;
    }

    handleBossCollision(player, boss) {
        const currentTime = this.time.now;

        // Vérifier si le joueur saute sur le boss
        if (player.body.touching.down && boss.body.touching.up) {
            // Vérifier le cooldown
            if (this.canHitBoss && (currentTime - this.lastHitTime) >= this.hitCooldown) {
                this.hitBoss();
                player.setVelocityY(-200); // Rebond
            } else {
                // Rebond même si cooldown
                player.setVelocityY(-200);
            }
        } else {
            // Touché sur le côté = mort
            this.playerDeath();
        }
    }

    hitBoss() {
        this.bossHealth--;
        this.lastHitTime = this.time.now;
        this.canHitBoss = false;

        // Flash du boss
        this.tweens.add({
            targets: this.funny,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 3
        });

        // Mettre à jour la barre de vie
        this.updateBossHealthBar();

        // Réactiver la possibilité de hit après le cooldown
        this.time.delayedCall(this.hitCooldown, () => {
            this.canHitBoss = true;
        });

        // Vérifier si le boss est vaincu
        if (this.bossHealth <= 0) {
            this.defeatBoss();
        }
    }

    bossAttack() {
        // Tween de rotation pour avertir
        this.tweens.add({
            targets: this.funny,
            angle: 15,
            duration: 300,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                this.funny.angle = 0;
                this.spawnExplosion();
            }
        });
    }

    spawnExplosion() {
        // Déterminer le secteur du joueur
        const playerInLeftSector = this.player.x < 150;

        // Position random dans le secteur approprié
        let explosionX;
        if (playerInLeftSector) {
            explosionX = Phaser.Math.Between(110, 150);
        } else {
            explosionX = Phaser.Math.Between(170, 210);
        }

        // Position Y aléatoire
        const explosionY = Phaser.Math.Between(90, 125);

        // Créer l'explosion
        const explosion = this.explosions.create(explosionX, explosionY, 'explosion');
        explosion.setScale(1);
        explosion.body.setAllowGravity(false);

        // Effet visuel d'apparition
        explosion.setAlpha(0);
        this.tweens.add({
            targets: explosion,
            alpha: 1,
            scale: 1.2,
            duration: 200,
            ease: 'Back.easeOut'
        });

        // Détruire après 0.5 seconde
        this.time.delayedCall(500, () => {
            explosion.destroy();
        });
    }

    hitByExplosion(player, explosion) {
        // Le joueur est touché par une explosion
        this.playerDeath();
    }

    playerDeath() {
        // Arrêter la scène et aller à DeathScene
        this.scene.stop('UIScene');
        this.scene.start('DeathScene');
    }

    defeatBoss() {
        // Pause du jeu
        this.physics.pause();

        // Flash blanc
        const flash = this.add.rectangle(320, 180, 640, 360, 0xffffff, 0);
        flash.setScrollFactor(0);
        flash.setDepth(2000);

        this.tweens.add({
            targets: flash,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                // Transition vers l'épilogue
                this.scene.stop('UIScene');
                this.scene.start('Epilogue');
            }
        });

        // Faire disparaître Funny
        this.tweens.add({
            targets: this.funny,
            alpha: 0,
            scale: 0,
            duration: 1000,
            ease: 'Power2'
        });
    }

    update(time, delta) {
        if (this.player) {
            this.player.update(time, delta);
        }

        if (this.player.y > 150) { // Ajuste selon ta map
            this.playerDeath();
        }

        // Faire suivre le regard de Funny au joueur
        if (this.funny && this.player) {
            if (this.player.x < 150) {
                this.funny.setFlipX(false);
            } else {
                this.funny.setFlipX(true);
            }
        }
    }
}