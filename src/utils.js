const normalizePlayerName = (name) => name.split(" ").join("").toLowerCase();

const buildGameUrl = (game) => {
    const white = normalizePlayerName(game.white.name);
    const black = normalizePlayerName(game.black.name);
    return `game/${white}-vs-${black}-${game.date}`;
};

module.exports = {
    buildGameUrl,
};
