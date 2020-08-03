import axios from "axios";

const API_URLS = Object.freeze({
    LIVE_RATINGS_BASE_URL: "https://fide-ratings-scraper.herokuapp.com",
    LICHESS_RATINGS_URL: "https://lichess.org/api/user",
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
