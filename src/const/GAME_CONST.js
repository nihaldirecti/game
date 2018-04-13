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
        PLAY: "Play"
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
    }
};

export default GAME_CONST;
