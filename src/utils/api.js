const PLAYER = Object.freeze({
  id: "rui-alves",
  username: "Rui-Alves",
  fide_num: 1962000,
})

export const getLivePlayerHistory = () => {
  return fetch(
    process.env.GATSBY_LIVE_RATINGS_BASE_URL +
      "?" +
      new URLSearchParams({
        operation: "getPlayerHistory",
        fideId: PLAYER.fide_num,
      })
  )
}

export const getLichessRatings = () =>
  fetch(`${process.env.GATSBY_LICHESS_RATINGS_URL}/${PLAYER.id}`)
