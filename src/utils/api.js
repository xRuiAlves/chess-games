import axios from "axios";

const RATINGS_API_BASE_URL = "https://lit-wildwood-98645.herokuapp.com";
const PLAYER_FIDE_NUM = 1962000;

export const getPlayerHistory = () => {
    const endpoint = `${RATINGS_API_BASE_URL}/player/${PLAYER_FIDE_NUM}/history`;

    return axios.get(endpoint);
};
