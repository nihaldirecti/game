'use strict';

import GAME_CONST from "../../const/GAME_CONST";

function GameInfo() {
    this.room = null;
    this.screenState = 0;
    this.playerData = null;
    this.gameResume = false;
    this.gameOver = false;
    this.gameLayoutLoaded = false;
    this.rpgElements = {
        health: 3,
        x_index: 0,
        y_index: 0,
        fist_index: 0,
        kick_index: 0,
        sword_index: 0,
        collectedCoinsInCurrentSession: 0,
        totalCollectedCoins: 0
    };
}

GameInfo.prototype.get = function (key) {
    return this[key];
};

GameInfo.prototype.set = function (key, val) {
    this[key] = val;
};

GameInfo.prototype.setBulk = function (arg) {
    for (let key in arg) {
        this[key] = arg[key];
    }
};

let gameInfo = new GameInfo();
export default gameInfo;