'use strict';

import GAME_CONST from "../const/GAME_CONST";

var Boot = {
    preload() {
        console.log("Preloading Boot State");
        this.load.image('progressBackground', 'assets/images/progressBackground.png');
        this.load.image('progressBar', 'assets/images/progressBar.png');
        this.load.tilemap('mario', 'assets/tilemaps/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
        this.load.image('player', 'assets/sprites/phaser-dude.png');
        this.load.image('enemy', 'assets/sprites/phaser-dude.png');
        this.load.image('button', 'assets/images/playGame.png', 193, 71);
        this.load.image('leftButton', 'assets/images/arrow_left.png');
        this.load.image('rightButton', 'assets/images/arrow_right.png');
        this.load.image('ground', 'assets/images/ground.png');
        this.load.spritesheet('bg', 'assets/images/asteroid_burned.png');
        this.load.atlas('xbox360', 'assets/images/xbox360.png', 'assets/controller/xbox360.json');
    },

    create() {
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.forceOrientation(true, true);
        this.input.maxPointers = 1;
        this.state.start(GAME_CONST.STATES.PRELOAD);
    }
};
export default Boot;