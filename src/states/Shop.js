'use strict';


export class Shop {
    preload() {
        console.log("Here");

    }

    create() {
        this.background = this.game.add.tileSprite(0, 0, 800, 600, 'bg');
        this.game.stage.backgroundColor = '#182d3b';
        this.button = this.game.add.button(100, 100, 'button', this.actionOnClick, this, 2, 1, 0);
        // this.game.stage.cen
        this.game.stage.addChild(this.button);
        console.log(this.stage.width);

        this.button.onInputOver.add(this.over, this);
        this.button.onInputOut.add(this.out, this);
        this.button.onInputUp.add(this.up, this);
        }

    update() {

    }

    up() {
    console.log('button up', arguments);
    }

    over() {
    console.log('button over');
    }

    out() {
        console.log('button out');
    }
    actionOnClick () {
        this.background.visible =! this.background.visible;
    }

}