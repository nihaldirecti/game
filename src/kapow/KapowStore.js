'use strict';

let KapowStore = {
    game: {
        get(key, successCallback, failureCallback) {
            kapow.gameStore.get(key, function (val) {
                console.log("Fetching gameStore " + key + " data successful", val);
                successCallback && successCallback(val);
            }.bind(this), function (error) {
                console.log("Fetching gameStore " + key + " data failed : ", error);
                failureCallback && failureCallback();
            });
        },

        set(key, param, successCallback, failureCallback) {
            kapow.gameStore.set(key, JSON.stringify(param), function () {
                console.log("Storing gameStore " + key + " data was successful :", param);
                successCallback && successCallback();
            }, function (error) {
                console.log("Storing gameStore " + key + " data Failed : ", error);
                failureCallback && failureCallback();
            });
        }
    },

    room: {
        get(key, successCallback, failureCallback) {
            kapow.roomStore.get(key, function (val) {
                console.log("Fetching gameStore " + key + " data successful", val);
                successCallback && successCallback(val);
            }.bind(this), function (error) {
                console.log("Fetching gameStore " + key + " data failed : ", error);
                failureCallback && failureCallback();
            });
        },

        set(key, param, successCallback, failureCallback) {
            kapow.roomStore.set(key, JSON.stringify(param), function () {
                console.log("Storing gameStore " + key + " data was successful :", param);
                successCallback && successCallback();
            }, function (error) {
                console.log("Storing gameStore " + key + " data Failed : ", error);
                failureCallback && failureCallback();
            });
        }
    }
};

export default KapowStore;