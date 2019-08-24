const path = require("path");
const data = require("./games.json");
const utils = require("./src/utils.js");

exports.createPages = ({ actions }) => {
    const { createPage } = actions;

    const template = path.resolve("./src/templates/game.js");

    data.forEach((game) => {
        createPage({
            path: utils.buildGameUrl(game),
            component: template,
            context: game,
        });
    });
};
