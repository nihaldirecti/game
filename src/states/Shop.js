'use strict';

import GAME_CONST from "../const/GAME_CONST";

export class Shop {
    preload() {
        console.log("Here");

    }

    create() {
        this.background = this.game.add.tileSprite(0, 0, 800, 600, 'bg');
        this.game.stage.backgroundColor = '#182d3b';
        console.log(this);
        var fun = this.actionOnClick.bind(this);
        this.button1 = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (1 / 4), GAME_CONST.CANVAS.HEIGHT * (1 / 3), 'button', fun, this, 2, 1, 0);
        this.button2 = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (2 / 4), GAME_CONST.CANVAS.HEIGHT * (1 / 3), 'button', this.actionOnClick, this, 2, 1, 0);
        this.button3 = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (3 / 4), GAME_CONST.CANVAS.HEIGHT * (1 / 3), 'button', this.actionOnClick, this, 2, 1, 0);
        this.button4 = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (1 / 4), GAME_CONST.CANVAS.HEIGHT * (2 / 3), 'button', this.actionOnClick, this, 2, 1, 0);
        this.button5 = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (2 / 4), GAME_CONST.CANVAS.HEIGHT * (2 / 3), 'button', this.actionOnClick, this, 2, 1, 0);
        this.button6 = this.game.add.button(GAME_CONST.CANVAS.WIDTH * (3 / 4), GAME_CONST.CANVAS.HEIGHT * (2 / 3), 'button', this.actionOnClick, this, 2, 1, 0);
        this.game.stage.addChild(this.button1);
        this.game.stage.addChild(this.button2);
        this.game.stage.addChild(this.button3);
        this.game.stage.addChild(this.button4);
        this.game.stage.addChild(this.button5);
        this.game.stage.addChild(this.button6);
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
    }

    update() {

    }

    up() {
    }

    over() {
    }

    out() {
    }

    actionOnClick(game) {
        console.log(this);
        console.log("HERE TOO!");
        this.game.state.start(GAME_CONST.STATES.SHOP);
    }

}