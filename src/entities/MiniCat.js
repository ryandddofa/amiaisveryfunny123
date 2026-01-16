import Phaser from 'phaser';

export default class MiniCat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, tint = 0xffffff) {
        super(scene, x, y, 'minicat');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Propriétés
        this.startX = x;
        this.setTint(tint);

        // Hitbox
        this.body.setSize(18, 26);
        this.body.setOffset(7, 2);

        // Variable pour tracker la direction
        this.movingRight = true;

        // Commence avec l'animation gauche
        this.play('minicat-walk-left');

        // Tween pour le mouvement gauche-droite
        scene.tweens.add({
            targets: this,
            x: x - 30, // Va à gauche d'abord
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Linear',
            onStart: () => {
                this.movingRight = true;
            },
            onYoyo: () => {
                this.movingRight = false;
            },
            onRepeat: () => {
                this.movingRight = true;
            }
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Change l'animation selon la direction
        if (this.movingRight) {
            this.play('minicat-walk-right', true);
        } else {
            this.play('minicat-walk-left', true);
        }
    }
}