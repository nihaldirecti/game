'use strict';

import PlayButton from "../objects/widgets/buttons/PlayButton";
import GAME_CONST from "../const/GAME_CONST";
import gameInfo from "../objects/Store/GameInfo";

var WebFontConfig = {
    active: function () {
        //phaserGame.time.events.add(Phaser.Timer.SECOND, createText, this);
    }
};

var Preload = {

    preload() {
        this.boss_spawned = false;
        this.counter = 0;
        this.enemy_spawn_at = [500, 1000, 1500, 2000];
        this.is_enemy_spawned = [false, false, false, false];
        this.is_enemy_dead = [false, false, false, false];

    },

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#787878';


        this._addMap();

        this.game.dumb_enemies = this.game.add.physicsGroup(
            Phaser.Physics.ARCADE,
            this.game.map,
            'enemies'
        );
        this.game.bosses = this.game.add.physicsGroup(
            Phaser.Physics.ARCADE,
            this.game.map,
            'bosses'
        );


        this.game.physics.arcade.gravity.y = 250;

        this._addHero();

        this._addOnScreenButtons();

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update() {
        if (this.p.health <= 0) {
            console.log("game over");
        }
        if (this.p.y > GAME_CONST.COORDINATES.y_max) {
            console.log("game over");
        }
        this.game.physics.arcade.collide(this.p, this.layer);
        if (this.boss) {
            this.game.physics.arcade.collide(this.boss, this.layer);
        }
        this.p.body.velocity.x = 0;
        for (var i = 0; i < this.enemy.length; i++) {
            if (this.is_enemy_dead[i] == false) {
                if (this.enemy[i].y > GAME_CONST.COORDINATES.enemy_y_max) {
                    console.log("enemy game over, i:" + i);
                    this.is_enemy_dead[i] = true;
                    this.enemy[i].destroy();
                }
                this.game.physics.arcade.collide(this.enemy[i], this.layer);
            }
        }
        var fun = this._handle_enemy_collide.bind(this, this.p);
        this.game.physics.arcade.overlap(this.game.dumb_enemies, this.p,
            fun, null, null);

        this._handle_input();
        this.check_n_spawn_enemy();
        this.check_n_spawn_boss();
        this._move_boss();
    },

    _handle_input(){
        if (this.cursors.up.isDown) {
            if (this.p.body.onFloor()) {
                this.p.body.velocity.y = -1 * GAME_CONST.VELOCITY.y[this.p.rpg.y_index];
            }
        }

        if (this.cursors.left.isDown) {
            this.p.body.velocity.x = -1 * GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        }
        else if (this.cursors.right.isDown) {
            this.p.body.velocity.x = GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        }

        if (this.leftButton.isPressed) {
            this.p.body.velocity.x = -1 * GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        }
        if (this.rightButton.isPressed) {
            this.p.body.velocity.x = GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        }
        if (this.jumpButton.isPressed && this.p.body.onFloor()) {
            this.p.body.velocity.y = -1 * GAME_CONST.VELOCITY.y[this.p.rpg.y_index];
        }
    },

    _move_boss(){
        if (this.boss_spawned) {
            if (this.boss.x + 100 <= this.boss.init_x && this.boss.state.val == 'moving_left') {
                this.boss.body.velocity.x = 0;
                this.boss.state.val = 'stationary_left';
                this.boss.state.fromTime = new Date().getTime();
            }

            if (this.boss.state.val == 'stationary_left'
                && this.boss.state.fromTime + GAME_CONST.BOSS.stationary_time < new Date().getTime()) {
                this.boss.state.val = 'moving_right';
                this.boss.body.velocity.x = 30;
            }

            if (this.boss.state.val == 'moving_right' && this.boss.x >= this.boss.init_x) {
                this.boss.state.val = 'moving_left';
                this.boss.body.velocity.x = -30;
            }


        }
    },

    _addHero(){
        this.p = this.game.add.sprite(32, 32, 'player');
        this.p.rpg = this._getRPGStats();
        this.p.health = this.p.rpg.health;
        this.enemy = [];
        this.game.physics.enable(this.p);

        this.p.body.bounce.y = 0.5;
        this.p.body.linearDamping = 1;
        this.p.body.collideWorldBounds = true;
        this.game.camera.follow(this.p);
    },

    _addMap() {
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
    },

    _addOnScreenButtons(){
        //add left button
        this.leftButton = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (1 / 5), GAME_CONST.CANVAS.HEIGHT * (1 / 4), 'leftButton', this._controller_clicked, this, 2, 1, 0);
        this.leftButton.name = "leftButton";
        this.leftButton.onInputDown.add(function (button) {
            button.isPressed = true;
        });
        this.leftButton.onInputUp.add(function (button) {
            button.isPressed = false;
        });

        //add right button
        this.rightButton = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (2 / 5), GAME_CONST.CANVAS.HEIGHT * (1 / 4), 'rightButton', this._controller_clicked, this, 2, 1, 0);
        this.rightButton.onInputDown.add(function (button) {
            button.isPressed = true;
        });
        this.rightButton.onInputUp.add(function (button) {
            button.isPressed = false;
        });

        //add jump button
        this.jumpButton = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (3 / 5), GAME_CONST.CANVAS.HEIGHT * (1 / 4), 'leftButton', this._controller_clicked, this, 2, 1, 0);
        this.jumpButton.name = "jumpButton";
        this.jumpButton.onInputDown.add(function (button) {
            button.isPressed = true;
        });
        this.jumpButton.onInputUp.add(function (button) {
            button.isPressed = false;
        });

        //add action button
        this.actionButton = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (4 / 5), GAME_CONST.CANVAS.HEIGHT * (1 / 4), 'rightButton', this._controller_clicked, this, 2, 1, 0);
        this.actionButton.name = "actionButton";
        this.actionButton.onInputDown.add(function (button) {
            button.isPressed = true;
        });
        this.actionButton.onInputUp.add(function (button) {
            button.isPressed = false;
        });

        this.leftButton.anchor.setTo(0.5, 0.5);
        this.rightButton.anchor.setTo(0.5, 0.5);
        this.jumpButton.anchor.setTo(0.5, 0.5);
        this.actionButton.anchor.setTo(0.5, 0.5);
    },

    _controller_clicked(button) {
        console.log(button);
        if (button.name == "leftButton") {
            this.p.body.velocity.x = -1 * GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        } else if (this.name == "rightButton") {
            console.log("WE are right" + button.name);
            this.p.body.velocity.x = GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        } else if (this.name == "jumpButton" && this.p.body.onFloor()) {
            this.p.body.velocity.y = -1 * GAME_CONST.VELOCITY.y[this.p.rpg.y_index];
        }
    },

    check_n_spawn_enemy() {
        if (this.p.x + 300 > this.enemy_spawn_at[this.counter] &&
            this.is_enemy_spawned[this.counter] == false) {
            this._spawn_enemy(this.counter, this.enemy_spawn_at[this.counter], 100);
            this.counter++;
        }
    },

    _spawn_enemy(i, x, y) {
        this.enemy[i] = this.game.dumb_enemies.create(x, y, 'enemy');
        this.game.physics.enable(this.enemy[i]);
        this.enemy[i].body.bounce.y = 0.5;
        this.enemy[i].body.bounce.x = 1;
        this.enemy[i].body.linearDamping = 1;
        this.enemy[i].body.collideWorldBounds = true;
        this.enemy[i].body.velocity.x = -30;
    },

    shutdown() {
        // for (let i = this.game.stage.children.length - 1; i >= 0; i--) {
        //     this.game.stage.removeChild(this.game.stage.children[i]);
        // }
    },


    _createLoader() {
        this.progressBar = this.add.sprite(this.world.centerX - 360, this.world.centerY, "progressBar");
        this.progressBar.anchor.setTo(0, 0.5);
        // this.game.stage.addChild(this.progressBar);
        this.load.setPreloadSprite(this.progressBar);

        this.progressBackground = this.add.sprite(this.world.centerX, this.world.centerY, "progressBackground");
        this.progressBackground.anchor.setTo(0.5, 0.5);
        // this.game.stage.addChild(this.progressBackground);
    },

    _onLoadComplete() {
        this._start();
    },

    _start() {
        this.loadingComplete = true;
    },

    _createPlayButton() {
        this.playButtton = new PlayButton({
            game: this.game,
            posX: this.world.centerX,
            posY: this.world.centerY,
            label: 'playGame',
            anchorX: 0.5,
            anchorY: 0.5
        });
        // this.game.stage.addChild(this.playButtton);
    },

    _handle_enemy_collide(p) {
        if (p.health > 0) {
            p.health--;
        }
    },

    check_n_spawn_boss() {
        if (this.p.x > GAME_CONST.COORDINATES.arena_x
            && this.boss_spawned == false) {
            this.boss_spawned = true;
            this._spawn_boss(GAME_CONST.COORDINATES.arena_x + 200, 50);
        }
    },

    _spawn_boss(x, y) {
        this.boss = this.game.bosses.create(x, y, 'enemy');
        this.boss.init_x = x;
        this.game.physics.enable(this.boss);
        this.boss.body.bounce.y = 0.5;
        this.boss.body.bounce.x = 1;
        this.boss.body.linearDamping = 1;
        this.boss.body.collideWorldBounds = true;
        this.boss.body.velocity.x = -30;
        this.boss.state = {};
        this.boss.state.val = 'moving_left';
    },

    _getRPGStats() {
        return gameInfo.rpgElements;
    },

    _setRPGStats(value) {
        gameInfo.rpgElements = value;
    }
};

export default Preload;