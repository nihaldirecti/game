'use strict';

import GAME_CONST from "../const/GAME_CONST";
import PlayButton from "../objects/widgets/buttons/PlayButton";
import gameInfo from "../objects/Store/GameInfo";

var Play = function () {
}


Play.prototype = {

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

        this.p = this.game.add.sprite(0, 0, 'character');
        this.p.rpg = this._getRPGStats();
        this.p.rpg.health = 1;
        this.enemy = [];

        this.game.physics.p2.enable(this.p);
        this.p.body.clearShapes();
        this.p.body.loadPolygon("mapPhysics", "phaser-dude");
        this.game.physics.p2.gravity.y = 4900;
        this.p.body.fixedRotation = true;
        this.game.camera.follow(this.p);
        this.p.animations.add('walk_left', [8, 9, 10, 11, 12, 13, 15]);
        this.p.animations.add('walk_right', [16, 17, 18, 19, 20, 21, 22, 23]);
        this.p.animations.add('attack_left', [0, 1, 2, 3]);
        this.p.animations.add('attack_right', [4, 5, 6, 7]);
        this.p.animations.play('attack_right', 10, true);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.gamepad.start();
        this.ground = this.add.sprite(3840, 747, 'platform', 0);
        this.ground.anchor.setTo(0, 0);
        console.log(this.sprite);
        this.game.physics.p2.enable(this.ground);
        //
        this.ground.body.clearShapes();
        this.ground.body.loadPolygon("mapPhysics", "ground");
        this.ground.body.dynamic = false;
        this.ground.body.gravityScale = 0;
        console.log(this.sprite);


        this.characterMaterial = this.game.physics.p2.createMaterial('characterMaterial', this.p.body);

        this.groundMaterial = this.game.physics.p2.createMaterial('groundMaterial', this.ground.body);


        this.contactMaterial = this.game.physics.p2.createContactMaterial(this.characterMaterial, this.groundMaterial);

        this.contactMaterial.restitution = 0;



        this.ramp1 = this.add.sprite(3490, 747, 'floating-ramp-1', 0);
        this.ramp1.anchor.setTo(0, 0);
        console.log(this.sprite);
        this.game.physics.p2.enable(this.ramp1);
        //
        this.ramp1.body.clearShapes();
        this.ramp1.body.loadPolygon("mapPhysics", "floating-ramp-1");
        this.ramp1.body.dynamic = false;
        this.ramp1.body.gravityScale = 0;

        console.log(this.ground);
        // setTimeout(function(){
        //     this.game.state.start(GAME_CONST.STATES.SHOP);
        // }.bind(this), 10000);
    },

    u_controller_clicked(button) {
        console.log(button);
        if (button.name == "leftButton") {
            this.p.body.velocity.x = -1 * GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        }
        else if (this.name == "rightButton") {
            console.log("WE are right" + button.name);
            this.p.body.velocity.x = GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        }
    },

    update() {
        // console.log("x: " + this.p.x + " y: " + this.p.y);
        this._adjustCharacterPhysicsBound();

        if (this.p.rpg.health <= 0) {
            // console.log("game over");
            // this.game.state.start(GAME_CONST.STATES.SHOP);
        }
        if (this.p.y > 1080) {
            // console.log("game over");
        }
        // this.p.rotation = 0;
        this.p.body.velocity.x = 0;
        // this.p.body.velocity.y = 0;
        let isCurserDown = false;
        if (this.cursors.up.isDown) {
            // if (this.p.body.onFloor()) {
            //     this.p.body.velocity.y = -1 * GAME_CONST.VELOCITY.y[this.p.rpg.y_index];
            // }
            this.p.body.velocity.y = -9 * GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
            isCurserDown = true;
        }
        else if (this.cursors.down.isDown) {
            // if (this.p.body.onFloor()) {
            //     this.p.body.velocity.y = -1 * GAME_CONST.VELOCITY.y[this.p.rpg.y_index];
            // }
            isCurserDown = true;
            // this.p.body.velocity.y =  2*GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
            if (this.p.frame >= 8 && this.p.frame < 16 || this.p.frame === 24) {
                this.p.animations.play('attack_left', 10, true);
            }
            else if (this.p.frame >= 16 && this.p.frame < 24 || this.p.frame === 25) {
                this.p.animations.play('attack_right', 10, true);
            }
        }

        if (this.cursors.left.isDown) {
            this.p.body.velocity.x = -2 * GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
            this.p.animations.play('walk_left', 10, true);
            isCurserDown = true;
        }
        else if (this.cursors.right.isDown) {
            this.p.body.velocity.x = 2 * GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
            this.p.animations.play('walk_right', 10, true);
            isCurserDown = true;
        }
        if (!isCurserDown) {
            this.p.animations.currentAnim.stop();
            if ((this.p.frame >= 8 && this.p.frame < 16) || (this.p.frame >= 0 && this.p.frame < 4)) {
                this.p.frameName = "standing-left.png";
            }
            else if ((this.p.frame >= 16 && this.p.frame < 24) || (this.p.frame >= 4 && this.p.frame < 8)) {
                this.p.frameName = "standing-right.png";
            }
        }
        // if (this.cursors.sp) {
        //     console.log(this.p.frame);
        //     // this.p.animations.play('walk_left',10,true);
        // }
        // else if (this.cursors.right.isDown) {
        //     // this.p.body.velocity.x = 2*GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        //     // this.p.animations.play('walk_right',10,true);
        // }
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

    _adjustCharacterPhysicsBound() {
        // this.p.body.clearShapes();
        //
        // if (this.p.frame == "walk") {
        //     objectName.body.loadPolygon(loadedJSONFileName, walkHitboxName);
        // }
        //
        // else if (currentAnimation == "fight") {
        //     objectName.body.loadPolygon(loadedJSONFileName, fightHitboxName);
        // }
        this.p.body.clearShapes();
        switch (this.p.frame) {
            case 0 : {
                this.p.body.loadPolygon("mapPhysics", "attack-left-1");
                break;
            }
            case 1 : {
                this.p.body.loadPolygon("mapPhysics", "attack-left-2");
                break;
            }
            case 2 : {
                this.p.body.loadPolygon("mapPhysics", "attack-left-3");
                break;
            }
            case 3 : {
                this.p.body.loadPolygon("mapPhysics", "attack-left-4");
                break;
            }
            case 4 : {
                this.p.body.loadPolygon("mapPhysics", "attack-right-1");
                break;
            }
            case 5 : {
                this.p.body.loadPolygon("mapPhysics", "attack-right-2");
                break;
            }
            case 6 : {
                this.p.body.loadPolygon("mapPhysics", "attack-right-3");
                break;
            }
            case 7 : {
                this.p.body.loadPolygon("mapPhysics", "attack-right-4");
                break;
            }
            case 8 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-left-1");
                break;
            }
            case 9 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-left-2");
                break;
            }
            case 10 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-left-3");
                break;
            }
            case 11 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-left-4");
                break;
            }
            case 12 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-left-5");
                break;
            }
            case 13 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-left-6");
                break;
            }
            case 14 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-left-7");
                break;
            }
            case 15 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-left-8");
                break;
            }
            case 16 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-right-1");
                break;
            }
            case 17 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-right-2");
                break;
            }
            case 18 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-right-3");
                break;
            }
            case 19 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-right-4");
                break;
            }
            case 20 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-right-5");
                break;
            }
            case 21 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-right-6");
                break;
            }
            case 22 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-right-7");
                break;
            }
            case 23 : {
                this.p.body.loadPolygon("mapPhysics", "character-run-right-8");
                break;
            }
            case 24: {
                this.p.body.loadPolygon("mapPhysics", "standing-left");
                break;
            }
            case 25: {
                this.p.body.loadPolygon("mapPhysics", "standing-right");
                break;
            }
            default: {
                console.log("Can't resolve Frame Index");
                break;
            }
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
export default Play;