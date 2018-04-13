'use strict';

import Planet from "../objects/widgets/sprites/Planet";
import SpaceShip from "../objects/widgets/images/SpaceShip";
import Shoot from "../objects/Widgets/sprites/Shoot";
import GAME_CONST from "../const/GAME_CONST";
import Meteor from "../objects/widgets/sprites/Meteor";
import TextUtil from "../util/TextUtil";
import PlayButton from "../objects/widgets/buttons/PlayButton";

var Play = {

    preload() {

    },

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#787878';
        console.log(this.game);
        this.player = this.add.image(32, 32, 'player');
        //this.game.stage.addChild(this.player);
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
        this.game.stage.addChild(this.layer);


        this.p = this.game.add.sprite(32, 32, 'player');
        this.game.physics.enable(this.p);

        this.game.physics.arcade.gravity.y = 250;

        this.p.body.bounce.y = 0.5;
        this.p.body.linearDamping = 1;
        this.p.body.collideWorldBounds = true;

        this.game.stage.addChild(this.p);
        this.game.camera.follow(this.p);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update() {
        this.game.physics.arcade.collide(this.p, this.layer);

        this.p.body.velocity.x = 0;

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
    },

    shutdown() {
        // for (let i = this.game.stage.children.length - 1; i >= 0; i--) {
        //     this.game.stage.removeChild(this.game.stage.children[i]);
        // }
    },

    _createScoreText() {
        // this.scoreText = TextUtil.createText(this.game, {
        //     positionX: 100,
        //     positionY: 100,
        //     message: this.score,
        //     align: "center",
        //     backgroundColor: "#000000",
        //     fill: "#fefefe",
        //     font: 'nunito-regular',
        //     fontSize: "60px",
        //     fontWeight: 800,
        //     wordWrapWidth: 355,
        //     anchorX: 0.5,
        //     anchorY: 0
        // });
        // this.game.stage.addChild(this.scoreText);
    },

    _changeScore() {
        // this.scoreText.text = this.score;
    },

    _createHealth() {
        // this.healthMetric = 100;
        // this.health = this.game.add.graphics(0, 0);
        // this.game.stage.addChild(this.health);
        // this.health.beginFill(0XFFBC3E);
        // this.health.arc(this.world.centerX, this.world.centerY, 130, this.game.math.degToRad(-90.00),
        //     this.game.math.degToRad(-89.9999), true, 360);
    },

    _createPlanet() {
        // this.planet = new Planet({
        //     game: this.game,
        //     posX: this.world.centerX,
        //     posY: this.world.centerY,
        //     label: 'planet',
        //     anchorX: 0.5,
        //     anchorY: 0.5
        // });
        // this.game.stage.addChild(this.planet);
    },

    _createSpaceShip() {
        // this.spaceShip = new SpaceShip({
        //     game: this.game,
        //     posX: this.world.centerX,
        //     posY: this.world.centerY,
        //     label: 'spaceShip',
        //     anchorX: 0.5,
        //     anchorY: 0.5
        // });
        // this.game.stage.addChild(this.spaceShip);
    },

    _changeShipDirection() {
        // this.spaceShipThrust *= -1;
        // this._shootProjectile();
        // this.game.camera.shake(0.0005, 500);
    },

    _shootProjectile() {
        // let position = this.spaceShip.previousPosition;
        // let shoot = new Shoot({
        //     game: this.game,
        //     posX: position.x,
        //     posY: position.y,
        //     label: 'shoot',
        //     angle: position.angle(this.centerPoint, true),
        //     anchorX: 0.5,
        //     anchorY: 0.5
        // });
        // this.projectiles.add(shoot);
    },

    _decreaseHealth() {
        // this.health && this.health.clear();
        // this.health && this.health.beginFill(0XFFBC3E);
        // this.health && this.health.arc(this.world.centerX, this.world.centerY, 130, this.game.math.degToRad(-90.00),
        //     this.game.math.degToRad(((100 - this.healthMetric) / 100.0) * 360 - 90), true, 360);
    },

    _endGame() {
        // kapow.invokeRPC('postScore', {"score": this.score}, function () {
        //     console.log("Success Posting Score");
        // }, function (error) {
        //     console.log("Failure Posting score", error);
        // });
        // this.gameEndText = TextUtil.createText(this.game, {
        //     positionX: this.world.centerX,
        //     positionY: 560,
        //     message: "Game Over",
        //     align: "center",
        //     backgroundColor: "#000000",
        //     fill: "#fefefe",
        //     font: 'nunito-regular',
        //     fontSize: "80px",
        //     fontWeight: 800,
        //     wordWrapWidth: 355,
        //     anchorX: 0.5,
        //     anchorY: 0
        // });
        // this.game.stage.addChild(this.gameEndText);
        // this._createPlayButton();
        // this._drawScoreboard();
    },

    _createPlayButton() {
        // this.playButtton = new PlayButton({
        //     game: this.game,
        //     posX: this.world.centerX,
        //     posY: this.world.centerY,
        //     label: 'playGame',
        //     anchorX: 0.5,
        //     anchorY: 0.5,
        //     callback: this.shutdown
        // });
        // this.game.stage.addChild(this.playButtton);
    },

    _drawScoreboard() {
        //     this.scoreboard = this.game.add.button(this.game.world.centerX, 1800, "scoreboard", this._renderScoreboard, this);
        //     this.scoreboard.anchor.setTo(0.5, 0);
        //     this.game.stage.addChild(this.scoreboard);
        // },
        //
        // _renderScoreboard() {
        //     kapow.boards.displayScoreboard({
        //         "metric": "score",
        //         "interval": "daily"
        //     });
    }
};
export default Play;