'use strict';

import GAME_CONST from "../const/GAME_CONST";

var Shop = function() {}
Shop.prototype = {
    preload() {
        console.log("Here");

    },

    create() {
        this.background = this.game.add.image(0, 0, 'bg');
        this.game.stage.backgroundColor = '#182d3b';
        console.log(this);
        // var fun = this.actionOnClick.bind(this);
        this.button1 = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (1 / 4), GAME_CONST.CANVAS.HEIGHT * (1 / 3), 'button', this.actionOnClick, this);
        this.button2 = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (2 / 4), GAME_CONST.CANVAS.HEIGHT * (1 / 3), 'button', this.actionOnClick, this);
        this.button3 = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (3 / 4), GAME_CONST.CANVAS.HEIGHT * (1 / 3), 'button', this.actionOnClick, this);
        this.button4 = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (1 / 4), GAME_CONST.CANVAS.HEIGHT * (2 / 3), 'button', this.actionOnClick, this);
        this.button5 = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (2 / 4), GAME_CONST.CANVAS.HEIGHT * (2 / 3), 'button', this.actionOnClick, this);
        this.button6 = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (3 / 4), GAME_CONST.CANVAS.HEIGHT * (2 / 3), 'button', this.actionOnClick, this);
        this.button1.anchor.setTo(0.5, 0.5);
        this.button1.scale.setTo(0.25, 0.25);
        this.button2.anchor.setTo(0.5, 0.5);
        this.button2.scale.setTo(0.25, 0.25);
        this.button3.anchor.setTo(0.5, 0.5);
        this.button3.scale.setTo(0.25, 0.25);
        this.button4.anchor.setTo(0.5, 0.5);
        this.button4.scale.setTo(0.25, 0.25);
        this.button5.anchor.setTo(0.5, 0.5);
        this.button5.scale.setTo(0.25, 0.25);
        this.button6.anchor.setTo(0.5, 0.5);
        this.button6.scale.setTo(0.25, 0.25);
        this.button1.onInputOver.add(this.over, this);
        this.button1.onInputOut.add(this.out, this);
        this.button1.onInputUp.add(this.up, this);
    },

    update() {

    },

    up() {
    },

    over() {
    },

    out() {
    },

    actionOnClick(game) {
        console.log(this);
        console.log("HERE TOO!");
        this.game.state.start(GAME_CONST.STATES.PRELOAD);
    }

};
export default Shop;