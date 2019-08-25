const normalizePlayerName = (name) => name.split(" ").join("").toLowerCase();

const buildGameUrl = (game) => {
    const white = normalizePlayerName(game.white.name);
    const black = normalizePlayerName(game.black.name);
    return `game/${white}-vs-${black}-${game.date}`;
};

const prettifyPlayerName = (name) => {
    let comma_index = name.indexOf(",");

    if (comma_index === -1) {
        const name_parts = name.split(" ");

        if (name_parts.length === 1) {
            return name;
        }

        name = `${name_parts[name_parts.length - 1]}, ${name_parts[0]}`;
        comma_index = name.indexOf(",");
    }

    if (name.length > 20) {
        return `${name.substr(0, comma_index + 3)}..`;
    } else {
        return name;
    }
};

const prettifyPlayerData = (player) => {
    const name = prettifyPlayerName(player.name);

    if (player.elo === 0) {
        player.elo = "no elo";
    }

    return player.elo ? `${name} (${player.elo})` : name;
};

module.exports = {
    buildGameUrl,
    prettifyPlayerData,
};
