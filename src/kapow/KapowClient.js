"use strict";

import gameInfo from "../objects/store/GameInfo";
import GameManager from "../controller/GameManager";
import GAME_CONST from "../const/GAME_CONST";
import KapowStore from "./KapowStore";

class KapowClient {

    handleOnLoad(room) {
        console.log("onload" + room);

        var default_RPG_elements = {
            health : 1,
            x_index : 0,
            y_index : 0,
            fist_index : 0,
            kick_index : 0,
            sword_index : 0
        };
        KapowStore.game.get(GAME_CONST.STORE_KEYS.RPG_ELEMENTS, function(value) {
            if (value) {
                console.log("rps_elements fetch successful" + value);
                gameInfo.rpgElements = value;
            } else {
                console.log("rpg_elements fetch unsuccessful");
                gameInfo.rpgElements = default_RPG_elements;
            }
        }, function (error) {
            console.log("rpg_elements fetch failed" + error);
            gameInfo.rpgElements = default_RPG_elements;
        });

        gameInfo.set("room", room);
        this._loadScreen();
    }

    handleOnGameEnd(outcome) {
        console.log("outcome" + outcome);
    }

    reloadScreen() {
        GameManager.loadGameScreen();
    }

    handleMessage(message) {
        console.log("message recieved" + message);
    }

    handleOnPause() {
        GameManager.updateSoundState(true);
    }

    handleBackButton() {
        console.log('BackButton Triggered.');
        kapow.analytics.sendEvent("back_tapped", {
            "type": "OS"
        });
        let screenState = gameInfo.get("screenState");
        console.log("screenState (backButton) :", screenState);
        kapow.close();
    }

    handleOnResume() {
        kapowStore.get("music", function (args) {
            console.log("gameStore fetch - Success.");
            console.log("Value fetched from gameStore was : ", args);
            let valueJSON = JSON.parse(args);
            GameManager.updateSoundState(valueJSON.volume === 0);
        });
        GameManager.loadGameScreen();
        console.log('On Resume Triggered.');
    }

    handleDisplayActiveRooms() {
        kapow.displayActiveRooms();
    }

    handleInvokeRPC(methodName, parameters, invokeLazily, successCallback, failureCallback) {
        if (invokeLazily) {
            kapow.rpc.invoke({
                    "functionName": methodName,
                    "parameters": parameters,
                    "invokeLazily": true
                },
                successCallback, failureCallback
            );
        }
        else {
            kapow.invokeRPC(methodName, parameters, successCallback, failureCallback);
        }
    }

    handleStartGameWithFriends(minimumNumberOfPlayers, maximumNumberOfPlayers, successCallback, failureCallback) {
        kapow.startGameWithFriends(minimumNumberOfPlayers, maximumNumberOfPlayers, successCallback, failureCallback);
    }

    handleStartGameWithRandomPlayers(attributes, successCallback, failureCallback) {
        kapow.startGameWithRandomPlayers(attributes, successCallback, failureCallback);
    }

    handleRematch(successCallback, failureCallback) {
        kapow.rematch(successCallback, failureCallback);
    }

    handleEndSoloGame(successCallback, failureCallback) {
        kapow.endSoloGame(successCallback, failureCallback);
    }

    handleFetchHistorySince(messageId, numberOfMessages, successCallback, failureCallback) {
        kapow.fetchHistorySince(messageId, numberOfMessages, successCallback, failureCallback);
    }

    handleFetchHistoryBefore(messageId, numberOfMessages, successCallback, failureCallback) {
        kapow.fetchHistoryBefore(messageId, numberOfMessages, successCallback, failureCallback);
    }

    handleSocialShare(text, medium, successCallback, failureCallback) {
        kapow.social.share(text, medium, successCallback, failureCallback);
    }

    handleAnalyticsEvent(eventName, attributes) {
        kapow.analytics.sendEvent(eventName, attributes);
    }

    handleUnloadRoom(successCallback, failureCallback) {
        kapow.unloadRoom(successCallback, failureCallback);
    }

    ////////////// END OF PUBLIC METHODS /////////

    _loadScreen() {
        console.log("Loading Player Info");
        kapow.getUserInfo(function (user) {
            console.log("Client getUserInfoSuccess - User: " + JSON.stringify(user));
            gameInfo.set("playerData", user.player);
            if (gameInfo.get("room") !== null) {
                gameInfo.set("gameResume", true);
            } else {
                gameInfo.set("gameResume", false);
            }
            console.log("Game about to be started.");
            GameManager.startGame();
        }.bind(this), function (error) {
            console.log("Client getUserInfo failure", error);
        });
    }
}

let kapowClient = new KapowClient();
export default kapowClient;