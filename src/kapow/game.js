"use strict";

import KapowClient from "./KapowClient";

window.game = {
    onLoad: function (room) {
    },
    onGameEnd: function (outcome) {
        console.log("CLIENT : Game Ended", outcome);
        // KapowClient.handleOnGameEnd(outcome);
    },
    onPlayerJoined: function (playerObj) {
        // console.log("CLIENT onPlayerJoined - " + JSON.stringify(playerObj));
    },
    onInviteRejected: function (playerObj) {
        // console.log("Client onInviteRejected - " + JSON.stringify(playerObj));
    },
    onPlayerLeft: function (playerObj) {
        // console.log("Client onPlayerLeft - " + JSON.stringify(playerObj));
    },
    onTurnChange: function (player) {
        // console.log("Player Turn Changed to : " + JSON.stringify(player));
    },
    onPause: function () {
        console.log('On Pause Triggered.');
        // KapowClient.handleOnPause();
    },
    onResume: function () {
        console.log('On Resume Triggered.');
        // KapowClient.handleOnResume();
    },
    onMessageReceived: function (message) {
        console.log('CLIENT : Message Received - ', JSON.stringify(message));
        // KapowClient.handleMessage(message);
    },
    onBackButtonPressed: function () {
        // KapowClient.handleBackButton();
        return true;
    },
    onRoomLockStatusChange: function (room) {
        console.log("Room Lock status changed for room :", room);
    }
};