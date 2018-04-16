'use strict';

import GAME_CONST from "../const/GAME_CONST";
import gameInfo from "../objects/Store/GameInfo";
import KapowStore from "../kapow/KapowStore";

var Shop = function() {};
Shop.prototype = {
    preload() {
        console.log("Here");
    },

    create() {

        this.totalCoins = gameInfo.totalCollectedCoins;

        this.game.stage.backgroundColor = '#182d3b';
        this.background = this.game.add.sprite(0, 0, 'upgradeBox');

        this.box1 = this.game.add.sprite(GAME_CONST.CANVAS.WIDTH * (1 / 6), GAME_CONST.CANVAS.HEIGHT * (1 / 3), 'upgrade-health');
        this.box2 = this.game.add.sprite(GAME_CONST.CANVAS.WIDTH * (2 / 6), GAME_CONST.CANVAS.HEIGHT * (1 / 3), 'upgrade-attack');
        this.box3 = this.game.add.sprite(GAME_CONST.CANVAS.WIDTH * (3 / 6), GAME_CONST.CANVAS.HEIGHT * (1 / 3), 'upgrade-speed');
        this.box4 = this.game.add.sprite(GAME_CONST.CANVAS.WIDTH * (4 / 6), GAME_CONST.CANVAS.HEIGHT * (1 / 3), 'upgrade-jump');

        this.healthLabel = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (1 / 6) + 40, GAME_CONST.CANVAS.HEIGHT * (1 / 3) - 70, 'Health(' + gameInfo.rpgElements.health + ')', { font: '60px Arial', fill: '#d38523', align: "center" });
        this.attackLabel = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (2 / 6) + 30, GAME_CONST.CANVAS.HEIGHT * (1 / 3) - 70, 'Attack(' + (gameInfo.rpgElements.sword_index + 1) + '/' + GAME_CONST.SWORD_DAMAGE.length + ')', { font: '60px Arial', fill: '#d38523', align: "center" });
        this.speedLabel = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (3 / 6) + 30, GAME_CONST.CANVAS.HEIGHT * (1 / 3) - 70, 'Speed(' + (gameInfo.rpgElements.x_index + 1) + '/' + GAME_CONST.VELOCITY.x.length + ')', { font: '60px Arial', fill: '#d38523', align: "center" });
        this.jumpLabel = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (4 / 6) + 30, GAME_CONST.CANVAS.HEIGHT * (1 / 3) - 70, 'Jump(' + (gameInfo.rpgElements.y_index + 1) + '/' + GAME_CONST.VELOCITY.y.length + ')', { font: '60px Arial', fill: '#d38523', align: "center" });

        this.costLabel1 = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (1 / 6) + 120, GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 10, GAME_CONST.UPGRADE_COST.HEALTH, { font: '30px Arial', fill: '#d38523', align: "center" });
        this.game.add.sprite(GAME_CONST.CANVAS.WIDTH * (1 / 6) + 140, GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 10, 'buy-coin');
        this.costLabel2 = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (2 / 6) + 120, GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 10, '1', { font: '30px Arial', fill: '#d38523', align: "center" });
        this.game.add.sprite(GAME_CONST.CANVAS.WIDTH * (2 / 6) + 140, GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 10, 'buy-coin');
        this.costLabel3 = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (3 / 6) + 120, GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 10, '1', { font: '30px Arial', fill: '#d38523', align: "center" });
        this.game.add.sprite(GAME_CONST.CANVAS.WIDTH * (3 / 6) + 140, GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 10, 'buy-coin');
        this.costLabel4 = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (4 / 6) + 120, GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 10, '1', { font: '30px Arial', fill: '#d38523', align: "center" });
        this.game.add.sprite(GAME_CONST.CANVAS.WIDTH * (4 / 6) + 140, GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 10, 'buy-coin');

        this.game.add.sprite(GAME_CONST.CANVAS.WIDTH * (1 / 6), GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 60, 'buy-background');
        this.game.add.sprite(GAME_CONST.CANVAS.WIDTH * (2 / 6), GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 60, 'buy-background');
        this.game.add.sprite(GAME_CONST.CANVAS.WIDTH * (3 / 6), GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 60, 'buy-background');
        this.game.add.sprite(GAME_CONST.CANVAS.WIDTH * (4 / 6), GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 60, 'buy-background');

        this.buyLabel1 = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (1 / 6) + 120, GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 70, 'BUY', { font: '30px Arial', fill: '#000', align: "center" });
        this.buyLabel2 = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (2 / 6) + 120, GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 70, 'BUY', { font: '30px Arial', fill: '#000', align: "center" });
        this.buyLabel3 = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (3 / 6) + 120, GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 70, 'BUY', { font: '30px Arial', fill: '#000', align: "center" });
        this.buyLabel4 = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (4 / 6) + 120, GAME_CONST.CANVAS.HEIGHT * (2 / 3) + 70, 'BUY', { font: '30px Arial', fill: '#000', align: "center" });

        this.buyLabel1.inputEnabled = true;
        this.buyLabel1.events.onInputDown.add(function() {
            if (this.totalCoins >= GAME_CONST.UPGRADE_COST.HEALTH) {
                this.totalCoins -= GAME_CONST.UPGRADE_COST.HEALTH;
                gameInfo.rpgElements.health += 1;
                gameInfo.totalCollectedCoins = this.totalCoins;
                this.costLabel1.text = GAME_CONST.UPGRADE_COST.HEALTH;
                this.healthLabel.text = 'Health(' + gameInfo.rpgElements.health + ')';
                this.coinsLabel.text = this.totalCoins + ' coins available';
                this.updateRPGElementsStore();
            }
        }, this);

        this.buyLabel2.inputEnabled = true;
        this.buyLabel2.events.onInputDown.add(function() {
            let index = gameInfo.rpgElements.sword_index;
            if (this.totalCoins >= GAME_CONST.UPGRADE_COST.SWORD_DAMAGE[index] && index <= GAME_CONST.SWORD_DAMAGE.length - 1) {
                this.totalCoins -= GAME_CONST.UPGRADE_COST.SWORD_DAMAGE[index];
                gameInfo.rpgElements.sword_index += 1;
                gameInfo.totalCollectedCoins = this.totalCoins;
                this.costLabel2.text = gameInfo.rpgElements.sword_index + 1 != GAME_CONST.SWORD_DAMAGE.length ? GAME_CONST.UPGRADE_COST.SWORD_DAMAGE[index] : '-';
                this.attackLabel.text = 'Attack(' + (gameInfo.rpgElements.sword_index + 1) + '/' + GAME_CONST.SWORD_DAMAGE.length + ')';
                this.coinsLabel.text = this.totalCoins + ' coins available';
                this.updateRPGElementsStore();
            }
        }, this);

        this.buyLabel3.inputEnabled = true;
        this.buyLabel3.events.onInputDown.add(function() {
            let index = gameInfo.rpgElements.x_index;
            if (this.totalCoins >= GAME_CONST.UPGRADE_COST.VELOCITY.x[index] && index <= GAME_CONST.VELOCITY.x.length - 1) {
                this.totalCoins -= GAME_CONST.UPGRADE_COST.VELOCITY.x[index];
                gameInfo.rpgElements.x_index += 1;
                gameInfo.totalCollectedCoins = this.totalCoins;
                this.costLabel3.text = gameInfo.rpgElements.x_index + 1 != GAME_CONST.VELOCITY.x.length ? GAME_CONST.UPGRADE_COST.VELOCITY.x[index] : '-';
                this.speedLabel.text = 'Speed(' + (gameInfo.rpgElements.x_index + 1) + '/' + GAME_CONST.VELOCITY.x.length + ')';
                this.coinsLabel.text = this.totalCoins + ' coins available';
                this.updateRPGElementsStore();
            }
        }, this);

        this.buyLabel4.inputEnabled = true;
        this.buyLabel4.events.onInputDown.add(function() {
            let index = gameInfo.rpgElements.y_index;
            if (this.totalCoins >= GAME_CONST.UPGRADE_COST.VELOCITY.y[index] && index <= GAME_CONST.VELOCITY.y.length - 1) {
                this.totalCoins -= GAME_CONST.UPGRADE_COST.VELOCITY.y[index];
                gameInfo.totalCollectedCoins = this.totalCoins;
                gameInfo.rpgElements.y_index += 1;
                this.costLabel4.text = gameInfo.rpgElements.y_index + 1 != GAME_CONST.VELOCITY.y.length ? GAME_CONST.UPGRADE_COST.VELOCITY.y[index] : '-';
                this.jumpLabel.text = 'Jump(' + (gameInfo.rpgElements.y_index + 1) + '/' + GAME_CONST.VELOCITY.y.length + ')';
                this.coinsLabel.text = this.totalCoins + ' coins available';
                this.updateRPGElementsStore();
            }
        }, this);

        this.coinsLabel = this.game.add.text(GAME_CONST.CANVAS.WIDTH * (1 / 6) + 50, GAME_CONST.CANVAS.HEIGHT - 120, this.totalCoins + ' coins available', { font: '70px Arial', fill: '#d38523', align: "center" });
        this.restartGameButton = this.game.add.image(GAME_CONST.CANVAS.WIDTH * (3 / 6) + 100, GAME_CONST.CANVAS.HEIGHT - 180, 'fast-forward');
        this.restartGameButton.inputEnabled = true;
        this.restartGameButton.events.onInputDown.add(this.restartGame, this);
    },

    update() {},

    restartGame() {
        this.game.state.start(GAME_CONST.STATES.PRELOAD);
    },

    updateRPGElementsStore() {
        KapowStore.game.set(GAME_CONST.STORE_KEYS.RPG_ELEMENTS, gameInfo.rpgElements, function() {
            console.log("rpg_elements set successful");
        }, function (error) {
            console.log("rpg_elements set failed" + error);
        });
    }

};
export default Shop;