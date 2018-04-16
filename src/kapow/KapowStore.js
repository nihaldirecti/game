'use strict';

let KapowStore = {
    game: {
        get(key, successCallback, failureCallback) {
            try {
                kapow.gameStore.get(key, function (val) {
                    console.log("Fetching gameStore " + key + " data successful", val);
                    successCallback && successCallback(val);
                }.bind(this), function (error) {
                    console.log("Fetching gameStore " + key + " data failed : ", error);
                    failureCallback && failureCallback();
                });
            } catch (error) {
                console.log("kapow not found" + error);
            }
        },

        set(key, param, successCallback, failureCallback) {
            try {
                kapow.gameStore.set(key, param, function () {
                    console.log("Storing gameStore " + key + " data was successful :", param);
                    successCallback && successCallback();
                }, function (error) {
                    console.log("Storing gameStore " + key + " data Failed : ", error);
                    failureCallback && failureCallback();
                });
            } catch (error) {
                console.log("kapow not found" + error);
            }
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
            kapow.roomStore.set(key, param, function () {
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