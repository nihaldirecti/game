'use strict';


import GAME_CONST from "../const/GAME_CONST";

var WebFontConfig = {
    active: function () {
        phaserGame.time.events.add(Phaser.Timer.SECOND, createText, this);
    }
};

var Preload = function () {
};
Preload.prototype = {
    preload() {
        this.ready = false;
        console.log("Preloading Assets");
        this.load.crossOrigin = "anonymous";
        this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        this.add.text(0, 0, "fontFix", {font: "1px nunito-regular", fill: "#000000"});
        this._createLoader();
        this.load.onLoadComplete.addOnce(this._onLoadComplete, this);
        // this.load.image('player', 'assets/sprites/phaser-dude.png');
        // this.load.image('enemy', 'assets/sprites/phaser-dude.png');
        this.load.image('leftButton', 'assets/images/arrow_left.png');
        this.load.image('rightButton', 'assets/images/arrow_right.png');
        this.load.image('platform', 'assets/images/ground.png');
        this.load.spritesheet('bg', 'assets/images/house.png');
        // this.load.atlas('xbox360', 'assets/images/xbox360.png', 'assets/controller/xbox360.json');
        this.game.load.atlas('character', 'assets/images/character.png', 'assets/data/character.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        this.load.image("floating-ramp-1", "assets/images/floating-ramp-1.png");
        this.load.image("floating-ramp-2", "assets/images/floating-ramp-2.png");
        this.load.image("floating-ramp-3", "assets/images/floating-ramp-3.png");
        this.load.image("floating-ramp-4", "assets/images/floating-ramp-4.png");
        this.load.image("house", "assets/images/house.png");
        this.load.image("alien", "assets/images/alien-small.png");

        this.load.physics("mapPhysics", "assets/data/mapPhysics.json");
        this.load.physics("mapPhysics", "assets/data/mapPhysics.json");

    },

    create() {

    },

    update() {
        if (this.ready) {
            console.log("Load Complete");
            this.game.state.start(GAME_CONST.STATES.PLAY);
        }
    },

    _createLoader() {
        console.log("Creating Loader");
        this.progressBar = this.game.add.sprite(GAME_CONST.CANVAS.WIDTH / 2 - 360, GAME_CONST.CANVAS.HEIGHT / 2, "progressBar");
        this.progressBar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.progressBar);

        this.progressBackground = this.add.sprite(GAME_CONST.CANVAS.WIDTH / 2, GAME_CONST.CANVAS.HEIGHT / 2, "progressBackground");
        this.progressBackground.anchor.setTo(0.5, 0.5);

    },

    _onLoadComplete() {
        this.progressBar.destroy();
        this.progressBackground.destroy();
        this.playButton = this.game.add.button(GAME_CONST.CANVAS.WIDTH / 2 - 138, GAME_CONST.CANVAS.HEIGHT / 2 - 101, "button", this._startGame, this);
        // this.playButton.anchor.setTo(0.5);
        console.log(this.playButton);
    },

    _startGame() {
        console.log("start");
        this.ready = true;
    }
};

export default Preload;