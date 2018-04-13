'use strict';

import PlayButton from "../objects/widgets/buttons/PlayButton";
import GAME_CONST from "../const/GAME_CONST";

var WebFontConfig = {
    active: function () {
        //phaserGame.time.events.add(Phaser.Timer.SECOND, createText, this);
    }
};

export class Preload {
    preload() {
        this.counter = 0;
        this.enemy_spawn_at = [500, 1000, 1500, 2000];
        this.is_enemy_spawned = [false, false, false, false];
        this.load.tilemap('mario', 'assets/tilemaps/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
        this.load.image('player', 'assets/sprites/phaser-dude.png');
        this.load.image('enemy', 'assets/sprites/phaser-dude.png');
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#787878';
        console.log(this.game);
        this.map = this.add.tilemap('mario');

        this.map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');

        //  14 = ? block
        this.map.setCollisionBetween(14, 15);

        this.map.setCollisionBetween(15, 16);
        this.map.setCollisionBetween(20, 25);
        this.map.setCollisionBetween(27, 29);
        this.map.setCollision(40);

        this.layer = this.map.createLayer('World1');
        this.layer.resizeWorld();

        this.game.dumb_enemies = this.game.add.physicsGroup(
            Phaser.Physics.ARCADE,
            this.game.map,
            'enemies'
        );
        this.p = this.game.add.sprite(32, 32, 'player');
        this.p.health = 1;
        this.enemy = [];
        this.game.physics.enable(this.p);

        this.game.physics.arcade.gravity.y = 250;

        this.p.body.bounce.y = 0.5;
        this.p.body.linearDamping = 1;
        this.p.body.collideWorldBounds = true;
        this.game.camera.follow(this.p);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.p.health <= 0) {
            console.log("game over");
        } else {
            console.log("its:" + this.p.health);
        }
        this.game.physics.arcade.collide(this.p, this.layer);
        this.p.body.velocity.x = 0;
        for (var i = 0; i < this.enemy.length; i++) {
            this.game.physics.arcade.collide(this.enemy[i], this.layer);
        }

        this.game.physics.arcade.overlap(this.game.dumb_enemies, this.p,
            this._handle_enemy_collide, null, this.p);

        if (this.cursors.up.isDown) {
            if (this.p.body.onFloor()) {
                this.p.body.velocity.y = -200;
            }
        }

        if (this.cursors.left.isDown) {
            this.p.body.velocity.x = -150;
        }
        else if (this.cursors.right.isDown) {
            this.p.body.velocity.x = 150;
        }
        this.check_n_spawn_enemy();
    }

    check_n_spawn_enemy() {
        if (this.p.x + 300 > this.enemy_spawn_at[this.counter] &&
            this.is_enemy_spawned[this.counter] == false) {
            this._spawn_enemy(this.counter, this.enemy_spawn_at[this.counter], 100);
            this.counter++;
        }
    }

    _spawn_enemy(i, x, y) {
        this.enemy[i] = this.game.dumb_enemies.create(x, y, 'enemy');
        this.game.physics.enable(this.enemy[i]);
        this.enemy[i].body.bounce.y = 0.5;
        this.enemy[i].body.bounce.x = 1;
        this.enemy[i].body.linearDamping = 1;
        this.enemy[i].body.collideWorldBounds = true;
        this.enemy[i].body.velocity.x = -30;
    }

    shutdown() {
        for (let i = this.game.stage.children.length - 1; i >= 0; i--) {
            this.game.stage.removeChild(this.game.stage.children[i]);
        }
    }


    _createLoader() {
        this.progressBar = this.add.sprite(this.world.centerX - 360, this.world.centerY, "progressBar");
        this.progressBar.anchor.setTo(0, 0.5);
        this.game.stage.addChild(this.progressBar);
        this.load.setPreloadSprite(this.progressBar);

        this.progressBackground = this.add.sprite(this.world.centerX, this.world.centerY, "progressBackground");
        this.progressBackground.anchor.setTo(0.5, 0.5);
        this.game.stage.addChild(this.progressBackground);
    }

    _onLoadComplete() {
        this._start();
    }

    _start() {
        this.loadingComplete = true;
    }

    _createPlayButton() {
        this.playButtton = new PlayButton({
            game: this.game,
            posX: this.world.centerX,
            posY: this.world.centerY,
            label: 'playGame',
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.game.stage.addChild(this.playButtton);
    }

    _handle_enemy_collide(enemies, p) {
        console.log("here");
        if (p.health > 0) {
            console.log("too");
            p.health--;
        }
        console.log("new" + p.health);
    }
}