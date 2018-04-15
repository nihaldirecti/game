'use strict';

import PlayButton from "../objects/widgets/buttons/PlayButton";
import GAME_CONST from "../const/GAME_CONST";
import gameInfo from "../objects/Store/GameInfo";

var WebFontConfig = {
    active: function () {
        //phaserGame.time.events.add(Phaser.Timer.SECOND, createText, this);
    }
};

var left = false;
var right = false;
var attack = false;
var jump = false;

export class Preload {

    preload() {
        this.boss_spawned = false;
        this.counter = 0;
        this.enemy_spawn_at = [500, 1000, 1500, 2000];
        this.is_enemy_spawned = [false, false, false, false];
        this.is_enemy_dead = [false, false, false, false];
        this.load.tilemap('mario', 'assets/tilemaps/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
        this.load.image('enemy', 'assets/sprites/phaser-dude.png');
        this.load.image('button', 'assets/images/playGame.png', 193, 71);
        this.game.load.image('heartFull', 'assets/images/heartFull.png');
        this.load.atlasJSONArray('player', 'assets/sprites/player.png', 'assets/sprites/player.json');

        //gamepad buttons
        this.load.spritesheet('button-vertical', 'assets/buttons/button-vertical.png',64,64);
        this.load.spritesheet('button-horizontal', 'assets/buttons/button-horizontal.png',96,64);
        this.load.spritesheet('button-diagonal', 'assets/buttons/button-diagonal.png',64,64);
        this.load.spritesheet('button-attack', 'assets/buttons/button-round-a.png',96,96);
    }

    create() {

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#787878';
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
        this.game.bosses = this.game.add.physicsGroup(
            Phaser.Physics.ARCADE,
            this.game.map,
            'bosses'
        );

        // setup our player
        this.p = this.game.add.sprite(32, 32, 'player', 'standing/right');
        this.p.isFacingTowardsRight = true;
        this.p.scale.setTo(0.2, 0.2);
        this.p.animations.add('walk_left', [8, 9, 10, 11, 12, 13, 14, 15]);
        this.p.animations.add('walk_right', [16, 17, 18, 19, 20, 21, 22, 23]);
        this.p.animations.add('attack_left', [0, 1, 2, 3]);
        this.p.animations.add('attack_right', [4, 5, 6, 7]);


        this.p.rpg = this._getRPGStats();
        this.p.health = 2;
        this.p.maxHealth = this.p.rpg.health;

        // setup our health indicator
        // this.healthMeterText = this.game.add.plugin(Phaser.Plugin.HealthMeter);
        // this.healthMeterText.text(this.p, {x: 400, y: 20, font: {font: "22px arial", fill: "#ff0000" }});

        this.healthMeterIcons = this.game.add.plugin(Phaser.Plugin.HealthMeter);
        this.healthMeterIcons.icons(this.p, {icon: 'heartFull', y: 20, x: 170, width: 16, height: 16, rows: 1});

        this.healthMeterBar = this.game.add.plugin(Phaser.Plugin.HealthMeter);
        this.healthMeterBar.bar(this.p, {
            y: 20, x: 50,
            width: 100, height: 20,
            foreground: '#ff0000',
            background: '#aa0000',
            alpha: 0.6
        });

        this.enemy = [];
        this.game.physics.enable(this.p);

        this.game.physics.arcade.gravity.y = 250;

        this.p.body.bounce.y = 0.5;
        this.p.body.linearDamping = 1;
        this.p.body.collideWorldBounds = true;
        this.game.camera.follow(this.p);

        this.cursors = this.game.input.keyboard.createCursorKeys();

        // create our virtual game controller buttons
        this.buttonfire = this.game.add.button(700, 450, 'button-attack', null, this, 0, 1, 0, 1);
        this.buttonfire.fixedToCamera = true;
        this.buttonfire.events.onInputOver.add(function(){attack=true;});
        this.buttonfire.events.onInputOut.add(function(){attack=false;});
        this.buttonfire.events.onInputDown.add(function(){attack=true;});
        this.buttonfire.events.onInputUp.add(function(){attack=false;});

        this.buttonleft = this.game.add.button(0, 472, 'button-horizontal', null, this, 0, 1, 0, 1);
        this.buttonleft.fixedToCamera = true;
        this.buttonleft.events.onInputOver.add(function(){left=true;});
        this.buttonleft.events.onInputOut.add(function(){left=false;});
        this.buttonleft.events.onInputDown.add(function(){left=true;});
        this.buttonleft.events.onInputUp.add(function(){left=false;});

        this.buttonright = this.game.add.button(160, 472, 'button-horizontal', null, this, 0, 1, 0, 1);
        this.buttonright.fixedToCamera = true;
        this.buttonright.events.onInputOver.add(function(){right=true;});
        this.buttonright.events.onInputOut.add(function(){right=false;});
        this.buttonright.events.onInputDown.add(function(){right=true;});
        this.buttonright.events.onInputUp.add(function(){right=false;});

        this.buttonupleft = this.game.add.button(32, 408, 'button-diagonal', null, this, 2, 0, 2, 0);
        this.buttonupleft.fixedToCamera = true;
        this.buttonupleft.events.onInputOver.add(function(){left=true;jump=true;});
        this.buttonupleft.events.onInputOut.add(function(){left=false;jump=false;});
        this.buttonupleft.events.onInputDown.add(function(){left=true;jump=true;});
        this.buttonupleft.events.onInputUp.add(function(){left=false;jump=false;});

        this.buttonupright = this.game.add.button(160, 408, 'button-diagonal', null, this, 3, 1, 3, 1);
        this.buttonupright.fixedToCamera = true;
        this.buttonupright.events.onInputOver.add(function(){right=true;jump=true;});
        this.buttonupright.events.onInputOut.add(function(){right=false;jump=false;});
        this.buttonupright.events.onInputDown.add(function(){right=true;jump=true;});
        this.buttonupright.events.onInputUp.add(function(){right=false;jump=false;});

        this.buttonup = this.game.add.button(96, 408, 'button-vertical', null, this, 0, 1, 0, 1);
        this.buttonup.fixedToCamera = true;
        this.buttonup.events.onInputOver.add(function(){jump=true;});
        this.buttonup.events.onInputOut.add(function(){jump=false;});
        this.buttonup.events.onInputDown.add(function(){jump=true;});
        this.buttonup.events.onInputUp.add(function(){jump=false;});
    }

    update() {
        // console.log("x: " + this.p.x + " y: " + this.p.y);
        if (this.p.health <= 0) {
            console.log("game over");
            this.game.state.start(GAME_CONST.STATES.SHOP);
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

        this.game.physics.arcade.overlap(this.p, this.game.dumb_enemies, this._handle_enemy_collide, null, null);

        if (this.cursors.up.isDown || jump) {
            if (this.p.body.onFloor()) {
                this.p.body.velocity.y = -1 * GAME_CONST.VELOCITY.y[this.p.rpg.y_index];
            }
        }

        // Running/Attack
        if (this.cursors.left.isDown || left) {
            this.p.body.velocity.x = -1 * GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
            this.p.animations.play('walk_left', 10, false);
            this.p.isFacingTowardsRight = false;
        } else if (this.cursors.right.isDown || right) {
            this.p.body.velocity.x = GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
            this.p.animations.play('walk_right', 10, false);
            this.p.isFacingTowardsRight = true;
        } else if (attack) {
            if (this.p.isFacingTowardsRight) {
                this.p.animations.play('attack_right', 10, false);
            } else {
                this.p.animations.play('attack_left', 10, false);
            }
        } else if (this.p.body.velocity.x == 0) {
            this.p.frame = this.p.isFacingTowardsRight ? 25 : 24;
        }



        // this works around a "bug" where a button gets stuck in pressed state
        if (this.game.input.currentPointers == 0 && !this.game.input.activePointer.isMouse){
            attack=false; right=false; left=false; jump=false;
        }

        this.check_n_spawn_enemy();
        this.check_n_spawn_boss();
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

    _handle_enemy_collide(player, enemy) {
        player.health--;
        enemy.kill();
        // GameManager.startState(GAME_CONST.STATES.PRELOAD);
    }

    check_n_spawn_boss() {
        if (this.p.x > GAME_CONST.COORDINATES.arena_x
            && this.boss_spawned == false) {
            this.boss_spawned = true;
            this._spawn_boss(GAME_CONST.COORDINATES.arena_x + 200, 50);
        }
    }

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
    }

    _getRPGStats() {
        return gameInfo.rpgElements;
    }

    _setRPGStats(value) {
        gameInfo.rpgElements = value;
    }
}