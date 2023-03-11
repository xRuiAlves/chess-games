const API_URLS = Object.freeze({
  LIVE_RATINGS_BASE_URL:
    "https://mik76pphacoyeatnv2ulw6mgbi0waxss.lambda-url.eu-west-1.on.aws/",
  LICHESS_RATINGS_URL: "https://lichess.org/api/user",
})

const PLAYER = Object.freeze({
  id: "rui-alves",
  username: "Rui-Alves",
  fide_num: 1962000,
})

export const getLivePlayerHistory = () =>
  fetch(
    API_URLS.LIVE_RATINGS_BASE_URL +
      "?" +
      new URLSearchParams({
        operation: "getPlayerHistory",
        fideId: PLAYER.fide_num,
      })
  )

export const getLichessRatings = () =>
  fetch(`${API_URLS.LICHESS_RATINGS_URL}/${PLAYER.id}`)
