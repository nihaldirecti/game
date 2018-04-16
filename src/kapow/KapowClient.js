"use strict";

import gameInfo from "../objects/store/GameInfo";
import GameManager from "../controller/GameManager";
import GAME_CONST from "../const/GAME_CONST";
import KapowStore from "./KapowStore";

class KapowClient {

    handleOnLoad() {
        console.log("onload");

        var default_RPG_elements = {
            health: 3,
            x_index: 0,
            y_index: 0,
            fist_index: 0,
            kick_index: 0,
            sword_index: 0,
            collectedCoinsInCurrentSession: 0,
            totalCollectedCoins: 0
        };
        KapowStore.game.get(GAME_CONST.STORE_KEYS.RPG_ELEMENTS, function (value) {
            if (value) {
                console.log("rpg_elements fetch successful" + value);
                gameInfo.rpgElements = value;
                console.log(gameInfo.rpgElements);
            } else {
                console.log("rpg_elements fetch unsuccessful");
                gameInfo.rpgElements = default_RPG_elements;
            }
        }, function (error) {
            console.log("rpg_elements fetch failed" + error);
            gameInfo.rpgElements = default_RPG_elements;
        });

    }

    // handleBackButton() {
    //     console.log('BackButton Triggered.');
    //     kapow.analytics.sendEvent("back_tapped", {
    //         "type": "OS"
    //     });
    //     let screenState = gameInfo.get("screenState");
    //     console.log("screenState (backButton) :", screenState);
    //     kapow.close();
    // }

    handleInvokeRPC(methodName, parameters, invokeLazily, successCallback, failureCallback) {
        try {
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
        } catch (error) {
            console.log("kapow not found" + error);
        }
    }

    handleStartSoloGame(successCallback, failureCallback) {
        try {
            kapow.startSoloGame(successCallback, failureCallback);
        } catch (error) {
            console.log("kapow not found" + error);
        }
    }

    handleEndSoloGame(successCallback, failureCallback) {
        try {
            kapow.endSoloGame(successCallback, failureCallback);
        } catch (error) {
            console.log("kapow not found" + error);
        }
    }
}

let kapowClient = new KapowClient();
export default kapowClient;