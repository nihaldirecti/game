"use strict";

import GAME_CONST from "../const/GAME_CONST";
import PhaserGame from "../PhaserGame";
import gameInfo from "../objects/Store/GameInfo";
import KapowClient from "../kapow/KapowClient";

let GameManager = {
    createGame() {
        this.game = new PhaserGame(GAME_CONST.CANVAS.WIDTH, GAME_CONST.CANVAS.HEIGHT, GAME_CONST.CANVAS.CONTAINER);
    },

    startGame() {
        this.game.state.start(GAME_CONST.STATES.BOOT);
    },

    startState(state) {
        this.game.state.start(state);
    },

    startSoloGame() {
        KapowClient.handleStartSoloGame(function (room) {
            console.log("Game Successfully Started." + room);
        }, function (error) {
            console.log("startSoloGame Failed : ", error);
        });
    },

    endSoloGame() {
        KapowClient.handleEndSoloGame(function () {
            // KapowClient.handleAnalyticsEvent("match_outcome_reached", {
            //     "outcome": "result"
            // });
            console.log("Game Successfully Closed.");
        }, function (error) {
            console.log("endSoloGame Failed : ", error);
        });

        var scores = {
            current_coins: gameInfo.collectedCoinsInCurrentSession,
            total_coins: gameInfo.totalCollectedCoins
        };
        console.log(scores);
        KapowClient.handleInvokeRPC("postScores", scores, true);
    }
};

export default GameManager;

