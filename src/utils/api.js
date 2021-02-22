import axios from "axios";

const API_URLS = Object.freeze({
    LIVE_RATINGS_BASE_URL: "https://fide-ratings-scraper.herokuapp.com",
    LICHESS_RATINGS_URL: "https://lichess.org/api/user",
    LICHESS_IMPORT_GAME_URL: "https://lichess.org/api/import",
});

const PLAYER = Object.freeze({
    id: "rui-alves",
    username: "Rui-Alves",
    fide_num: 1962000,
});

export const getLivePlayerHistory = () => (
    axios.get(`${API_URLS.LIVE_RATINGS_BASE_URL}/player/${PLAYER.fide_num}/history`)
);

export const getLichessRatings = () => (
    axios.get(`${API_URLS.LICHESS_RATINGS_URL}/${PLAYER.id}`)
);

export const importLichessGame = (pgn) => {
    const form_content = { pgn };

    let form = [];
    for (const property in form_content) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(form_content[property]);
        form.push(`${encodedKey}=${encodedValue}`);
    }
    form = form.join("&");

    return fetch(API_URLS.LICHESS_IMPORT_GAME_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: form,
    });
};
