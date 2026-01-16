import Phaser from 'phaser';

export default class Gia extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player) {
        // Commence à la position du joueur avec offset
        super(scene, player.x - 40, player.y, 'gia');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Référence au joueur
        this.player = player;

        // Offset par rapport au joueur
        this.offsetX = -40; // 40 pixels derrière

        // Propriétés
        this.body.setAllowGravity(false); // Pas de gravité!
        this.speed = 80; // Vitesse de suivi (un peu plus lent que le joueur)

        // Hitbox
        this.body.setSize(30, 20);
        this.body.setOffset(7, 4);

        // Direction actuelle
        this.lastDirection = 'right';

        // Jouer l'animation idle au départ
        this.play('gia-walk-right');
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Position cible (joueur + offset)
        const targetX = this.player.x + this.offsetX;

        // Distance entre Gia et la cible
        const distanceX = targetX - this.x;

        // Si Gia est trop loin, il se déplace
        if (Math.abs(distanceX) > 5) { // Seuil de 5 pixels
            // Se déplacer vers la cible
            if (distanceX > 0) {
                this.setVelocityX(this.speed);
                this.play('gia-walk-right', true);
                this.lastDirection = 'right';
            } else {
                this.setVelocityX(-this.speed);
                this.play('gia-walk-left', true);
                this.lastDirection = 'left';
            }
        } else {
            // Arrêter si assez proche
            this.setVelocityX(0);
        }

        // Garder le Y à la même hauteur que le joueur (suit le sol)
        this.y = this.player.y;
    }
}