import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'amia');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Propriétés du joueur
        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.speed = 100;
        this.jumpForce = -300;
        this.isGrounded = false;

        // ===== AJUSTE LA HITBOX =====
        // Définir la taille réelle du body (16x32)
        this.body.setSize(16, 16);

        // Centrer le body sur le sprite (offset depuis le coin haut-gauche)
        // Le sprite fait 48x64, le body fait 16x32
        // Pour centrer horizontalement: (48-16)/2 = 16
        // Pour aligner en bas: 64-32 = 32
        this.body.setOffset(16, 24);

        // Rendre la hitbox visible pour debug (enlève plus tard)
        this.setDebugBodyColor(0x00ff00);

        // Collision avec les plateformes
        scene.physics.add.collider(this, scene.platforms, () => {
            if (this.body.touching.down) {
                this.isGrounded = true;
            }
        });

        // Inputs clavier pour fallback PC
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    update(time, delta) {
        const mobileInputs = this.scene.registry.get('playerInputs');

        if (this.body.touching.down) {
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }

        let isMoving = false;

        // Mouvement horizontal
        if (mobileInputs.left || this.cursors.left.isDown || this.wasd.left.isDown) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true); // ← Flip pour aller à gauche
            isMoving = true;

            if (this.isGrounded) {
                this.play('amia-walk', true);
            }
        } else if (mobileInputs.right || this.cursors.right.isDown || this.wasd.right.isDown) {
            this.setVelocityX(this.speed);
            this.setFlipX(false); // ← Normal pour aller à droite
            isMoving = true;

            if (this.isGrounded) {
                this.play('amia-walk', true);
            }
        } else {
            this.setVelocityX(0);

            // Idle au sol (garde la direction)
            if (this.isGrounded) {
                this.play('amia-idle', true);
            }
        }

        // Saut
        if ((mobileInputs.jump || this.cursors.up.isDown || this.wasd.up.isDown) && this.isGrounded) {
            this.setVelocityY(this.jumpForce);
            this.isGrounded = false;
        }

        // Animation de saut en l'air
        if (!this.isGrounded) {
            this.play('amia-jump', true);
        }
    }
}