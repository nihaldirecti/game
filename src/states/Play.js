'use strict';

import GAME_CONST from "../const/GAME_CONST";
import PlayButton from "../objects/widgets/buttons/PlayButton";
import gameInfo from "../objects/Store/GameInfo";
import GameManager from "../controller/GameManager";
import KapowStore from "../kapow/KapowStore"

var Play = function () {
};


Play.prototype = {

    preload() {
        var default_RPG_elements = {
            health: 3,
            x_index: 0,
            y_index: 0,
            fist_index: 0,
            kick_index: 0,
            sword_index: 0,
            collectedCoinsInCurrentSession: 0,
            totalCollectedCoins: 0
        };
        KapowStore.game.get(GAME_CONST.STORE_KEYS.RPG_ELEMENTS, function (value) {
            if (value) {
                console.log("rpg_elements fetch successful" + value);
                gameInfo.rpgElements = value;
            } else {
                console.log("rpg_elements fetch unsuccessful");
                gameInfo.rpgElements = default_RPG_elements;
            }
        }, function (error) {
            console.log("rpg_elements fetch failed" + error);
            gameInfo.rpgElements = default_RPG_elements;
        });
        console.log("coins" + gameInfo.rpgElements.totalCollectedCoins);

        this.boss_spawned = false;
        this.counter = 0;
        this.is_enemy_spawned = [];
        this.enemy = [];
        this.ramp = [];
        this.coinCount = 0;
        this.cutterHealthAdded = false;
        this.gameOver = false;
        this.gameOverMarked = false;
    },

    create() {

        this.game.physics.startSystem(Phaser.Physics.P2JS);


        this.game.world.setBounds(0, 0, 7680, 1080);

        //add backgrounds
        this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'background').anchor.set(0.5);

        //add clouds
        this._add_cloud();
        this.p = this.game.add.sprite(50, 0, 'character');
        this.p.rpg = this._getRPGStats();
        this.p.health = this.p.rpg.health;
        this.p.maxHealth = this.p.rpg.health;
        this.p.attackDamage = GAME_CONST.SWORD_DAMAGE[this.p.rpg.sword_index];
        this.enemy = [];

        this.game.physics.p2.enable(this.p);
        this.yAxis = p2.vec2.fromValues(0, 1);
        this.p2vec2 = p2.vec2;
        this.p.body.loadPolygon("mapPhysics", "phaser-dude");
        this.game.physics.p2.gravity.y = 4900;
        this.p.body.fixedRotation = true;
        this.game.camera.follow(this.p);
        this.p.animations.add('walk_left', [8, 9, 10, 11, 12, 13, 15]);
        this.p.animations.add('walk_right', [16, 17, 18, 19, 20, 21, 22, 23]);
        this.p.animations.add('attack_left', [0, 1, 2, 3]);
        this.p.animations.add('attack_right', [4, 5, 6, 7]);
        this.p.animations.play('attack_right', 10, true);
        this.p.attack = {};
        this.p.attack.isAttacking = false;
        this.p.canAttack = true;
        this.p.attack.since = new Date().getTime();
        this.p.isDead = false;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.gamepad.start();
        this.ground = this.add.sprite(3840, 747, 'platform', 0);
        this.ground.anchor.setTo(0, 0);
        this.game.physics.p2.enable(this.ground);
        this._add_health_bar();
        //
        this.ground.body.clearShapes();
        this.ground.body.loadPolygon("mapPhysics", "ground");
        this.ground.body.dynamic = false;
        this.ground.body.gravityScale = 0;


        this.characterMaterial = this.game.physics.p2.createMaterial('characterMaterial', this.p.body);

        this.groundMaterial = this.game.physics.p2.createMaterial('groundMaterial', this.ground.body);


        this.contactMaterial = this.game.physics.p2.createContactMaterial(this.characterMaterial, this.groundMaterial);

        this.contactMaterial.restitution = 0;
        //init dumb enemies
        this.game.dumb_enemies = this.game.add.physicsGroup(
            Phaser.Physics.P2JS,
            this.game.map,
            'aliens'
        );
        this.game.dumb_enemies.lastSpawned = new Date().getTime();

        this._add_static_ramps();
        this._add_enemy_home();
        this._addOnScreenButtons();
        this._addCoins();
        this._add_cutter();
        this.scoreText = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (17 / 20), GAME_CONST.CANVAS.HEIGHT * (1 / 120), this.coinCount, {
            font: "150px Arial",
            fill: "#aaaaaa",
            align: "right"
        });
        this.scoreText.fixedToCamera = true;
        this.gameOverText = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (1 / 2), GAME_CONST.CANVAS.HEIGHT * (1 / 2), "", {
            font: "150px Arial",
            fill: "#aaaaaa",
            align: "right"
        });
        this.gameOverText.anchor.setTo(0.5, 0.5);
        this.gameOverText.fixedToCamera = true;

        this.gameOverWinText = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (1 / 2), GAME_CONST.CANVAS.HEIGHT * (1 / 2), "", {
            font: "150px Arial",
            fill: "#aaaaaa",
            align: "right"
        });
        this.gameOverWinText.anchor.setTo(0.5, 0.5);
        this.gameOverWinText.fixedToCamera = true;

        //add grass
        this.game.add.image(0, 870, 'grass_3').anchor.set(0.5);
        this.game.add.image(500, 870, 'grass_2').anchor.set(0.5);
        this.game.add.image(1000, 870, 'grass_2').anchor.set(0.5);
        this.game.add.image(2640, 870, 'grass_3').anchor.set(0.5);
        this.game.add.image(4265, 840, 'grass_2').anchor.set(0.5);
        this.game.add.image(4760, 840, 'grass_2').anchor.set(0.5);
    },

    _add_cutter(){
        this.cutter = this.game.add.sprite(7170, 400, 'cutter');
        this.game.physics.p2.enable(this.cutter);
        this.cutter.animations.add('alien-medium-1.png', [0, 1]);
        this.cutter.animations.add('alien-medium-2.png', [0]);
        this.cutter.animations.play('alien-medium-1.png', 10, true);
        this.cutter.isAttacking = true;
        this.cutter.lastAttacked = 0;
        this.cutter.lastHurted = 0;
        this.cutter.maxHealth = 6;
        this.cutter.health = 6;
    },

    _addCoins(){
        this.coins = [];
        this.coins[0] = this.add.sprite(1420, 300, 'coin', 0);
        this.coins[1] = this.add.sprite(1340, 230, 'coin', 0);
        this.coins[2] = this.add.sprite(1220, 220, 'coin', 0);
        this.coins[3] = this.add.sprite(1120, 220, 'coin', 0);
        this.coins[4] = this.add.sprite(2800, 220, 'coin', 0);
        this.coins[5] = this.add.sprite(2900, 220, 'coin', 0);
        this.coins[6] = this.add.sprite(3000, 220, 'coin', 0);
        this.coins[7] = this.add.sprite(3350, 240, 'coin', 0);
        this.coins[8] = this.add.sprite(4250, 240, 'coin', 0);
        this.coins[9] = this.add.sprite(4350, 240, 'coin', 0);

        for (let i = 0; i < this.coins.length; i++) {
            this.coins[i].anchor.set(0.5);
            this.game.physics.p2.enable(this.coins[i]);
            if (i != 7) {
                this.coins[i].body.collideWorldBounds = false;
                this.coins[i].body.dynamic = false;
                this.coins[i].body.gravityScale = 0;
                this.coins[i].body.clearShapes();
            }
        }
    },

    _addOnScreenButtons(){
        this.leftButton = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (1 / 10), GAME_CONST.CANVAS.HEIGHT * (7 / 8) + 50, 'leftB', this._controller_clicked, this, 2, 1, 0);
        this.leftButton.name = "leftButton";
        this.leftButton.onInputDown.add(function (button) {
            button.isPressed = true;
        });
        this.leftButton.onInputUp.add(function (button) {
            button.isPressed = false;
        });

        //add right button
        this.rightButton = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (2 / 10), GAME_CONST.CANVAS.HEIGHT * (7 / 8) + 50, 'rightB', this._controller_clicked, this, 2, 1, 0);
        this.rightButton.onInputDown.add(function (button) {
            button.isPressed = true;
        });
        this.rightButton.onInputUp.add(function (button) {
            button.isPressed = false;
        });

        //add jump button
        this.jumpButton = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (8 / 10), GAME_CONST.CANVAS.HEIGHT * (7 / 8) + 50, 'upB', this._controller_clicked, this, 2, 1, 0);
        this.jumpButton.name = "jumpButton";
        this.jumpButton.onInputDown.add(function (button) {
            button.isPressed = true;
        });
        this.jumpButton.onInputUp.add(function (button) {
            button.isPressed = false;
        });

        //add action button
        this.actionButton = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (9 / 10), GAME_CONST.CANVAS.HEIGHT * (7 / 8) + 50, 'actB', this._controller_clicked, this, 2, 1, 0);
        this.actionButton.name = "actionButton";
        this.actionButton.onInputDown.add(function (button) {
            button.isPressed = true;
        });
        this.actionButton.onInputUp.add(function (button) {
            button.isPressed = false;
        });

        this.leftButton.anchor.setTo(0.5, 0.5);
        this.leftButton.fixedToCamera = true;
        this.rightButton.anchor.setTo(0.5, 0.5);
        this.rightButton.fixedToCamera = true;
        this.jumpButton.anchor.setTo(0.5, 0.5);
        this.jumpButton.fixedToCamera = true;
        this.actionButton.anchor.setTo(0.5, 0.5);
        this.actionButton.fixedToCamera = true;
    },

    _add_cutter_healthbar(){
        if (this.cutter != undefined) {
            this.healthMeterIcons = this.game.add.plugin(Phaser.Plugin.HealthMeter);
            this.healthMeterIcons.icons(this.cutter, {
                icon: 'heart',
                y: GAME_CONST.CANVAS.HEIGHT * (1 / 54),
                x: GAME_CONST.CANVAS.WIDTH * (22 / 40),
                width: 128,
                height: 128,
                rows: 1
            });
        }
        this.scoreText.setText("");
        this.scoreText = null;
    },

    _add_health_bar() {
        this.healthMeterIcons = this.game.add.plugin(Phaser.Plugin.HealthMeter);
        this.healthMeterIcons.icons(this.p, {
            icon: 'heart',
            y: GAME_CONST.CANVAS.HEIGHT * (1 / 54),
            x: GAME_CONST.CANVAS.WIDTH * (1 / 40),
            width: 128,
            height: 128,
            rows: 1
        });
    },

    _add_cloud(){

        this.cloud = [];
        this.cloud[0] = this.add.sprite(400, 200, 'cloud_3', 0);
        this.cloud[1] = this.add.sprite(2000, 100, 'cloud_1', 0);
        this.cloud[2] = this.add.sprite(4000, 450, 'cloud_3', 0);
        this.cloud[3] = this.add.sprite(6500, 350, 'cloud_2', 0);
        this.cloud[4] = this.add.sprite(8500, 200, 'cloud_1', 0);
        for (let i = 0; i < this.cloud.length; i++) {
            this.cloud[i].anchor.set(0.5);
            this.game.physics.p2.enable(this.cloud[i]);
            this.cloud[i].body.collideWorldBounds = false;
            this.cloud[i].body.dynamic = false;
            this.cloud[i].body.gravityScale = 0;
            this.cloud[i].body.velocity.x = -10;
            this.cloud[i].body.clearShapes();
        }

    },
    _add_enemy_home() {
        this.enemy_home = this.add.sprite(1300, 773, 'house', 0);
        this.enemy_home.anchor.setTo(0, 0);
        this.game.physics.p2.enable(this.enemy_home);
        //
        this.enemy_home.body.clearShapes();
        this.enemy_home.body.loadPolygon("mapPhysics", 'house');
        this.enemy_home.body.dynamic = false;
        this.enemy_home.body.gravityScale = 0;
    },

    _check_n_spawn_enemy() {
        var count = 0;
        var length = this.enemy.length;
        for (let i = 0; i < this.enemy.length; i++) {
            if (this.enemy[i].body != null) {
                count++;
            }
        }
        var currentSpawn = new Date().getTime();
        if (count == 0 && (currentSpawn > this.game.dumb_enemies.lastSpawned + 5000)) {
            this.enemy[length] = this.game.dumb_enemies.create(1200, 773, 'alien');
            this.game.physics.p2.enable(this.enemy[length]);
            this.enemy[length].body.velocity.x = -200;
            this.game.dumb_enemies.lastSpawned = currentSpawn;
        }
    },

    _move_enemies(){
        let i = 0
        for (; i < this.enemy.length; i++) {
            if (this.enemy[i].body != null) {
                this.enemy[i].body.velocity.x = -200;
            }
            if (this.enemy[i].body != null && this.enemy[i].body.x < 95) {
                this.enemy[i].destroy();
            }
        }
    },

    _coin_consumption(){
        for (let i = 0; i < this.coins.length; i++) {
            if (this.coins[i].body != null) {
                if (this._check_if_collides(this.coins[i])) {
                    this.coinCount++;
                    this.coins[i].destroy();
                }
            }
        }
    },

    _check_who_dies() {
        if (this.p.isDead) {
            return true;
        }

        if (this.p.attack == undefined) {
            return;
        }
        for (let i = 0; i < this.enemy.length; i++) {
            if (this.enemy[i].body != null) {
                if (this._check_if_collides(this.enemy[i])) {
                    if (this.p.attack.isAttacking) {
                        this.enemy[i].destroy();
                        return false;
                    } else {
                        this.enemy[i].destroy();
                        this._hurt_p(1);
                        return true;
                    }
                }
            }
        }
        if (this._check_if_collides(this.cutter)) {
            if (this.cutter.isAttacking) {
                let time = new Date().getTime();
                if (time > 2000 + this.cutter.lastAttacked) {
                    this._hurt_p(1);
                    this.cutter.lastAttacked = time;
                }
            } else if (this.p.attack.isAttacking) {
                let time = new Date().getTime();
                if (time > 2000 + this.cutter.lastHurted) {
                    this.cutter.health -= this.p.attackDamage;
                    this.cutter.lastHurted = time;
                    if (this.cutter.health <= 0) {
                        this.cutter.destroy();
                        this.gameOver = true;
                        this.gameOverTime = new Date().getTime();
                    }
                }
            }
        }
        return false;
    },

    _hurt_p(x){
        this.p.health -= x;
        if (this.p.health == 0) {
            let x = this.p.body.x;
            let y = this.p.body.y;
            this.p.destroy();
            this.p = this.add.sprite(x, y, "dead", 0);
            this.p.anchor.set(0.5);
            this.game.physics.p2.enable(this.p);
            this.p.isDead = true;
            this.p.isDeadSince = new Date().getTime();
        }
    },

    _check_if_collides(enemy){
        if (Math.abs(enemy.x - this.p.x) < enemy.width / 2 + this.p.width / 2) {
            if (Math.abs(enemy.y - this.p.y) < enemy.height / 2 + this.p.height / 2) {
                return true;
            }
        }
        return false;
    },

    _add_static_ramps() {
        this._add_ramp_at_pos(1142, 427, 'floating-ramp-1');
        this._add_ramp_at_pos(2890, 397, 'floating-ramp-2');
        this._add_ramp_at_pos(3345, 297, 'floating-ramp-3');
        this.ramp[2].min_y = 347;
        this.ramp[2].max_y = 647;
        this.ramp[2].state = 'stationary_top';
        this.ramp[2].stateSince = new Date().getTime();
        this._add_ramp_at_pos(3866, 397, 'floating-ramp-4');
    },

    _move_dynamic_ramp() {
        for (let i = 0; i < this.cloud.length; i++) {
            this.cloud[i].body.velocity.x = -50;
        }
        if (this.ramp[2] != undefined && this.ramp[2].stateSince != undefined) {
            var currentTime = new Date().getTime();
            if (this.ramp[2].state == 'stationary_top' &&
                currentTime > this.ramp[2].stateSince + 5000) {
                this.ramp[2].state = 'moving_bottom';
                this.ramp[2].stateSince = currentTime;
                this.ramp[2].body.velocity.y = 200;
            }
            if (this.ramp[2].state == 'moving_bottom' &&
                this.ramp[2].y > this.ramp[2].max_y) {
                this.ramp[2].state = 'stationary_bottom';
                this.ramp[2].stateSince = currentTime;
                this.ramp[2].body.velocity.y = 0;
            }
            if (this.ramp[2].state == 'stationary_bottom' &&
                currentTime > this.ramp[2].stateSince + 1500) {
                this.ramp[2].state = 'moving_up';
                this.ramp[2].stateSince = currentTime;
                this.ramp[2].body.velocity.y = -200;
            }
            if (this.ramp[2].state == 'moving_up' &&
                this.ramp[2].y < this.ramp[2].min_y) {
                this.ramp[2].state = 'stationary_top';
                this.ramp[2].stateSince = currentTime;
                this.ramp[2].body.velocity.y = 0;
            }
        }
    },

    _add_ramp_at_pos(x, y, image) {
        var rampCount = this.ramp.length;
        this.ramp[rampCount] = this.add.sprite(x, y, image, 0);
        this.ramp[rampCount].anchor.setTo(0, 0);
        this.game.physics.p2.enable(this.ramp[rampCount]);
        //
        this.ramp[rampCount].body.clearShapes();
        this.ramp[rampCount].body.loadPolygon("mapPhysics", image);
        this.ramp[rampCount].body.dynamic = false;
        this.ramp[rampCount].body.gravityScale = 0;
    },

    u_controller_clicked(button) {
        if (button.name == "leftButton") {
            this.p.body.velocity.x = -1 * GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        }
        else if (this.name == "rightButton") {
            this.p.body.velocity.x = GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
        }
    },

    update() {
        if (this.gameOver) {
            if (new Date().getTime() > this.gameOverTime + 5000) {
                this.game.state.start(GAME_CONST.STATES.SHOP);
            }
            this.gameOverWinText.setText("GAME OVER! You WIN");
            return;
        }
        if (!this.cutterHealthAdded && this.p.body.x > 5700) {
            this._add_cutter_healthbar();
            this.cutterHealthAdded = true;
        }
        this._check_who_dies();
        this._check_if_drown();
        if (this.p.isDead) {
            this.p.body.velocity.y = -100;
            this.p.body.velocity.x = -100;
            if (new Date().getTime() > 5000 + this.p.isDeadSince) {
                gameInfo.rpgElements.collectedCoinsInCurrentSession = this.coinCount;
                gameInfo.rpgElements.totalCollectedCoins += this.coinCount;
                this.game.state.start(GAME_CONST.STATES.SHOP);
                GameManager.endSoloGame();
            }
            this.gameOverText.setText("GAME OVER!");
            return;
        }
        try {
            this._adjustCharacterPhysicsBound();
            this._check_n_spawn_enemy();
            this._move_enemies();
            this._update_attack_sequence();
            this._check_who_dies();
            this._coin_consumption();
            this._cutter_updates();
            this.p.body.velocity.x = 0;
            // this.p.body.velocity.y = 0;
            let isCurserDown = false;
            if (this.cursors.up.isDown || this.jumpButton.isPressed) {
                // if (this.p.body.onFloor()) {
                //     this.p.body.velocity.y = -1 * GAME_CONST.VELOCITY.y[this.p.rpg.y_index];
                // }
                if (this._checkIfCanJump()) {
                    this.p.body.velocity.y = -9 * GAME_CONST.VELOCITY.y[this.p.rpg.y_index];
                }
                isCurserDown = true;
            }
            //should have been stationary before attacking
            else if ((this.cursors.down.isDown || this.actionButton.isPressed)
                && this.p.canAttack) {
                this.p.attack.isAttacking = true;
                this.p.attack.since = new Date().getTime();
            }
            if (this.p.attack != undefined && this.p.attack.isAttacking) {
                isCurserDown = true;
                if ((this.p.frame >= 8 && this.p.frame < 16) || (this.p.frame >= 0 && this.p.frame < 3) || this.p.frame === 24) {
                    this.p.animations.play('attack_left', 10, true);
                }
                else if ((this.p.frame >= 16 && this.p.frame < 24) || (this.p.frame >= 4 && this.p.frame < 7) || this.p.frame === 25) {
                    this.p.animations.play('attack_right', 10, true);
                }
            }

            if (this.cursors.left.isDown || this.leftButton.isPressed) {
                this.p.body.velocity.x = -2 * GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
                this.p.animations.play('walk_left', 10, true);
                this.p.canAttack = false;
                isCurserDown = true;
                this.p.attack.isAttacking = false;
            }
            else if (this.cursors.right.isDown || this.rightButton.isPressed) {
                this.p.body.velocity.x = 3 * GAME_CONST.VELOCITY.x[this.p.rpg.x_index];
                this.p.animations.play('walk_right', 10, true);
                this.p.canAttack = false;
                isCurserDown = true;
                this.p.attack.isAttacking = false;
            }
            if (!isCurserDown) {
                this.p.animations.currentAnim.stop();
                if ((this.p.frame >= 8 && this.p.frame < 16) || (this.p.frame >= 0 && this.p.frame < 4)) {
                    this.p.frameName = "standing-left.png";
                    this.p.canAttack = "true";
                }
                else if ((this.p.frame >= 16 && this.p.frame < 24) || (this.p.frame >= 4 && this.p.frame < 8)) {
                    this.p.frameName = "standing-right.png";
                    this.p.canAttack = true;
                }
            }

            this._move_dynamic_ramp();
            if (this.scoreText != null) {
                this.scoreText.setText(this.coinCount);
            }
        } catch (e) {
        }
    },

    _update_attack_sequence()
    {
        let current = new Date().getTime();
        if (this.p.attack != undefined && this.p.attack.isAttacking && current > this.p.attack.since + 500) {
            this.p.attack.isAttacking = false;
        }
    },

    _check_if_drown(){
        if (!this.p.isDead
            && this.p.body.x > 2967
            && this.p.body.y > 821
            && this.p.body.x < 3929) {
            this._hurt_p(this.p.health);
        }
    },
    _cutter_updates(){
        let key = parseInt((new Date().getTime() % 10000) / 1000) % 4;
        if (this.cutter.body != null) {
            if (this.cutter.isAttacking
                && key <= 1) {
                this.cutter.isAttacking = false;
                this.cutter.animations.play('alien-medium-2.png', 10, true);
            } else if (!this.cutter.isAttacking && key > 1) {
                this.cutter.isAttacking = true;
                this.cutter.animations.play('alien-medium-1.png', 10, true);
            }
        }
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

    _checkIfCanJump() {
        var result = false;
        for (var i = 0; i < this.game.physics.p2.world.narrowphase.contactEquations.length; i++) {
            var c = this.game.physics.p2.world.narrowphase.contactEquations[i];

            if (c.bodyA === this.p.body.data || c.bodyB === this.p.body.data) {
                var d = this.p2vec2.dot(c.normalA, this.yAxis);

                if (c.bodyA === this.p.body.data) {
                    d *= -1;
                }

                if (d > 0.5) {
                    result = true;
                }
            }
        }

        return result;

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
    }
};
export default Play;