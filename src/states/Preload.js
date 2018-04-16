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
        this.load.image('platform', 'assets/images/ground.png');
        this.load.image('dead', 'assets/images/dead.png');
        this.load.image('heart', 'assets/images/heart.png');
        this.load.image('cloud_1', 'assets/images/cloud_1.png');
        this.load.image('cloud_2', 'assets/images/cloud_2.png');
        this.load.image('cloud_3', 'assets/images/cloud_3.png');
        this.load.image('grass_1', 'assets/images/grass_1.png');
        this.load.image('grass_2', 'assets/images/grass_2.png');
        this.load.image('grass_3', 'assets/images/grass_3.png');
        this.load.image('background', 'assets/images/bg.png');
        this.load.spritesheet('bg', 'assets/images/house.png');
        this.game.load.atlas('character', 'assets/images/character.png', 'assets/data/character.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        this.game.load.atlas('cutter', 'assets/images/alien-medium.png', 'assets/data/alien-medium.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        this.load.image("floating-ramp-1", "assets/images/floating-ramp-1.png");
        this.load.image("floating-ramp-2", "assets/images/floating-ramp-2.png");
        this.load.image("floating-ramp-3", "assets/images/floating-ramp-3.png");
        this.load.image("floating-ramp-4", "assets/images/floating-ramp-4.png");
        this.load.image("leftB", "assets/images/back.png");
        this.load.image("rightB", "assets/images/fornt.png");
        this.load.image("upB", "assets/images/jump.png");
        this.load.image("actB", "assets/images/attack_button.png");
        this.load.image("house", "assets/images/house.png");
        this.load.image("alien", "assets/images/alien-small.png");
        this.load.image("coin", "assets/images/coins.png");

        this.load.physics("mapPhysics", "assets/data/mapPhysics.json");
        this.load.physics("mapPhysics", "assets/data/mapPhysics.json");

        // Shop Assets
        this.load.image("upgradeBox", "assets/images/upgradeBox.png");
        this.load.image("upgrade-health", "assets/images/upgrade-health.png");
        this.load.image("upgrade-attack", "assets/images/upgrade-attack.png");
        this.load.image("upgrade-speed", "assets/images/upgrade-speed.png");
        this.load.image("upgrade-jump", "assets/images/upgrade-jump.png");
        this.load.image("buy-coin", "assets/images/buy-coin.png");
        this.load.image("buy-background", "assets/images/buy-background.png");
        this.load.image("fast-forward", "assets/images/fast-forward.png");

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
    },

    _startGame() {
        console.log("start");
        this.ready = true;
    }
};

export default Preload;