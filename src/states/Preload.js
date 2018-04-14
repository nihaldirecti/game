'use strict';

import PlayButton from "../objects/widgets/buttons/PlayButton";
import GAME_CONST from "../const/GAME_CONST";
import gameInfo from "../objects/Store/GameInfo";

var WebFontConfig = {
    active: function () {
        //phaserGame.time.events.add(Phaser.Timer.SECOND, createText, this);
    }
};

var Preload = function() {};
Preload.prototype = {
    preload() {
        this.boss_spawned = false;
        this.counter = 0;
        this.enemy_spawn_at = [500, 1000, 1500, 2000];
        this.is_enemy_spawned = [false, false, false, false];
        this.is_enemy_dead = [false, false, false, false];
        console.log("Test", this.load);


    },

    create() {

        this.game.physics.startSystem(Phaser.Physics.P2JS);


        this.game.world.setBounds(0, 0, 7680, 1080);




        // this.leftButton = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (1 / 4), GAME_CONST.CANVAS.HEIGHT * (1 / 3), 'leftButton', this._controller_clicked, this, 2, 1, 0);
        // this.leftButton.name = "leftButton";
        // this.leftButton.onInputDown.add(function (button) {
        //     button.isPressed = true;
        // });
        // this.leftButton.onInputUp.add(function (button) {
        //     button.isPressed = false;
        // });
        // this.rightButton = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (2 / 4), GAME_CONST.CANVAS.HEIGHT * (1 / 3), 'rightButton', this._controller_clicked, this, 2, 1, 0);
        // this.rightButton.onInputDown.add(function (button) {
        //     button.isPressed = true;
        // });
        // this.rightButton.onInputUp.add(function (button) {
        //     button.isPressed = false;
        // });

        // this.leftButton.anchor.setTo(0.5, 0.5);
        // this.rightButton.anchor.setTo(0.5, 0.5);

        //end gamepad

        // this.game.physics.startSystem(Phaser.Physics.ARCADE);


        // this.map.setCollisionBetween(14, 15);

        // this.map.setCollisionBetween(15, 16);
        // this.map.setCollisionBetween(20, 25);
        // this.map.setCollisionBetween(27, 29);
        // this.map.setCollision(40);



        this.p = this.game.add.sprite(0, 0, 'player');
        this.p.rpg = this._getRPGStats();
        this.p.rpg.health = 1;
        this.enemy = [];

        this.game.physics.p2.enable(this.p);
        this.p.body.clearShapes();
        this.p.body.loadPolygon("mapPhysics", "phaser-dude");
        this.game.physics.p2.gravity.y = 980;
        this.game.camera.follow(this.p);

        this.p.body.collideWorldBounds

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.gamepad.start();
        // this.ground = this.game.add.tileSprite(0, 414, 7680, 666, 'platform');
        this.ground = this.add.sprite(3840, 747 ,'platform', 0);
        this.ground.anchor.setTo(0,0);
        console.log(this.sprite);
        this.game.physics.p2.enable(this.ground);

        this.ground.body.clearShapes();
        this.ground.body.loadPolygon("mapPhysics", "ground");
        // this.ground.body.velocity.x = 0;
        // this.ground.body.velocity.y = 0;
        // this.ground.body.mass = 0;
        // this.ground.immovable = true;
        this.ground.body.dynamic = false;
        this.ground.body.gravityScale = 0;
        console.log(this.sprite);


        console.log(this.ground);
        setTimeout(function(){
            this.game.state.start(GAME_CONST.STATES.SHOP);
        }.bind(this), 10000);
        //
    },

    _controller_clicked(button) {
        console.log(button);
        if (button.name == "leftButton") {
            this.p.body.velocity.x = -1 *GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        }
        else if (this.name == "rightButton") {
            console.log("WE are right" + button.name);
            this.p.body.velocity.x = GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        }
    },

    update() {
        // console.log("x: " + this.p.x + " y: " + this.p.y);
        this.p.y +=10;
        if (this.p.rpg.health <= 0) {
            // console.log("game over");
            // this.game.state.start(GAME_CONST.STATES.SHOP);
        }
        if (this.p.y > 1080) {
            // console.log("game over");
        }
        this.p.body.velocity.x = 0;
        // this.p.body.velocity.y = 0;

        if (this.cursors.up.isDown) {
            // if (this.p.body.onFloor()) {
            //     this.p.body.velocity.y = -1 * GAME_CONST.VELOCITY.y[this.p.rpg.y_index];
            // }
            this.p.body.velocity.y = -2*GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        }

        if (this.cursors.down.isDown) {
            // if (this.p.body.onFloor()) {
            //     this.p.body.velocity.y = -1 * GAME_CONST.VELOCITY.y[this.p.rpg.y_index];
            // }
            this.p.body.velocity.y =  2*GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        }

        if (this.cursors.left.isDown) {
            this.p.body.velocity.x = -10* GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        }
        else if (this.cursors.right.isDown) {
            this.p.body.velocity.x = 10*GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        }

        // this.check_n_spawn_enemy();
        // this.check_n_spawn_boss();
        // if (this.boss_spawned) {
        //     if (this.boss.x + 100 <= this.boss.init_x && this.boss.state.val == 'moving_left') {
        //         this.boss.body.velocity.x = 0;
        //         this.boss.state.val = 'stationary_left';
        //         this.boss.state.fromTime = new Date().getTime();
        //     }
        //
        //     if (this.boss.state.val == 'stationary_left'
        //         && this.boss.state.fromTime + GAME_CONST.BOSS.stationary_time < new Date().getTime()) {
        //         this.boss.state.val = 'moving_right';
        //         this.boss.body.velocity.x = 30;
        //     }
        //
        //     if (this.boss.state.val == 'moving_right' && this.boss.x >= this.boss.init_x) {
        //         this.boss.state.val = 'moving_left';
        //         this.boss.body.velocity.x = -30;
        //     }
        //
        //
        // }
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
        if (p.rpg.health > 0) {
            p.rpg.health--;
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