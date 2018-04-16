'use strict';

import GAME_CONST from "../const/GAME_CONST";

var Boot = function () {
};
Boot.prototype = {
    preload() {
        console.log("Preloading Boot State");
        this.load.image('progressBackground', 'assets/images/progressBackground.png');
        this.load.image('progressBar', 'assets/images/progressBar.png');
        this.load.image('button', 'assets/images/playGame.png');
    },

    create() {
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.forceOrientation(false, true);
        this.input.maxPointers = 6;
        this.state.start(GAME_CONST.STATES.PRELOAD);
    }
};
export default Boot;