const path = require("path");
const data = require("./games.json");
const utils = require("./src/utils.js");

exports.createPages = ({ actions }) => {
    const { createPage } = actions;

    const game_template = path.resolve("./src/templates/game.js");
    const event_template = path.resolve("./src/templates/event.js");

    const events = {};

    data.forEach((game) => {
        if (!events[game.event]) {
            events[game.event] = [];
        }
        events[game.event].push(game);

        createPage({
            path: utils.buildGameUrl(game),
            component: game_template,
            context: game,
        });
    });

    Object.keys(events).forEach((event_name) => {
        createPage({
            path: utils.buildEventUrl(event_name),
            component: event_template,
            context: {
                event: event_name,
                games: events[event_name],
            },
        });
    });
};
