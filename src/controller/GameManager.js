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

    updateSoundState(value) {
        if (this.game.state.states.Preload && this.game.state.states.Preload.sound) {
            // this.game.state.states.Preload.sound.mute = value;
            // this.game.state.states.Preload.winSound.mute = value;
            // this.game.state.states.Preload.tapSound.mute = value;
            // this.game.state.states.Preload.sound.loop = true;
            // this.game.state.states.Preload.sound.volume = GAME_CONST.VOLUME.THEME;
        }
    },

    playTapSound() {
        // this.game.state.states.Preload.tapSound.play();
        // this.game.state.states.Preload.tapSound.volume = GAME_CONST.VOLUME.TAP;
    },

    playWinSound() {
        // this.game.state.states.Preload.winSound.play();
        // this.game.state.states.Preload.winSound.volume = GAME_CONST.VOLUME.WIN;
    },

    stopWinSound() {
        // this.game.state.states.Preload.winSound.stop();
    },

    renderScreen() {
        // if (gameInfo.get("gameResume") === true) {
        //     let gameType = gameInfo.get("gameType");
        //     gameType === GAME_CONST.GAME_TYPE.SOLO ? this.startState(GAME_CONST.STATES.PLAYLOAD) : GameManager.loadGameScreen();
        // }
        // else {
        //     this.startState(GAME_CONST.STATES.MENU);
        // }
    },

    setScreenState(screen) {
        gameInfo.set("screenState", screen);
    },

    resetScreenState() {
        gameInfo.set("screenState", this._currentScreenState(this.game.state.current));
    },

    resetGameState() {
        // GameManager.startState(GAME_CONST.STATES.MENU);
    },

    ////////////// END OF PUBLIC METHODS /////////

    _handleGameEnd(gameResult) {
        if (gameInfo.get("gameOver") === false) {
            gameInfo.set("gameOver", true);
        }
        this._kapowEndSoloGame(gameResult);
    },

    _currentScreenState(state) {
        switch (state) {
            case GAME_CONST.STATES.PLAY : {
                return GAME_CONST.SCREEN.PLAY;
            }
            case GAME_CONST.STATES.PRELOAD : {
                return GAME_CONST.SCREEN.PRELOAD;
            }
            default : {
                console.log("Unexpected state received:", state);
            }
        }
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
            KapowClient.handleAnalyticsEvent("match_outcome_reached", {
                "outcome": "result"
            });
            console.log("Game Successfully Closed.");
        }, function (error) {
            console.log("endSoloGame Failed : ", error);
        });

        var scores = {
            current_coins: gameInfo.collectedCoinsInCurrentSession,
            total_coins: gameInfo.totalCollectedCoins
        };
        KapowClient.handleInvokeRPC("postScores", scores, true);
    },

    _resetRoom() {
        kapow.unloadRoom(function () {
            console.log('Room Successfully Unloaded');
        }, function () {
            console.log('Room Unloading Failed');
        });
        gameInfo.setBulk({
            "gameResume": false,
            "room": null,
            "gameOver": false,
            "win": 0
        });
    }
};

export default GameManager;

