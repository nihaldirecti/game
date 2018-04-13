"use strict";

const GAME_CONST = {
    CANVAS: {
        WIDTH: 800,
        HEIGHT: 600,
        CONTAINER: "uss-callister"
    },
    STATES: {
        BOOT: "Boot",
        PRELOAD: "Preload",
        PLAY: "Play",
        SHOP: "Shop"
    },
    MUSIC: {
        VOLUME: {
            THEME: 0.2,
            TAP: 0.1
        }
    },
    SPEED: {
        METEOR: 400,
        SHOOT: 600,
        SPACE_SHIP: 0.08
    },
    COORDINATES: {
        y_max: 170,
        enemy_y_max: 175,
        arena_x: 40//3040
    },
    BOSS: {
        stationary_time: 3000
    },
    VELOCITY: {
        x : [150, 170, 200],
        y : [200, 250, 300]
    },

    FIST_DAMAGE : [50, 100, 150, 200],

    KICK_DAMAGE : [75, 150, 225],

    SWORD_DAMAGE : [100, 200, 300]
};

export default GAME_CONST;
