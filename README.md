# Chess Games

Source of my chess site at [chess.ruialves.net](https://chess.ruialves.net). It lists the tournaments I played, their games, and my FIDE and Lichess ratings. Built with [Astro](https://astro.build).

## Development

Requires Node.js 24 (LTS).

```sh
npm install
npm run dev      # local server at http://localhost:4321
npm run build    # static site in dist/
npm run preview  # serve the build locally
npm run check    # type-check the project
```

## Add a tournament

Add an object to `data/events.json`. Dates use the `DD-MM-YYYY` format, and fields without a value are `null`:

```json
{
  "name": "Torneio Interno GXP 2026",
  "date": "10-01-2026",
  "finishDate": "14-02-2026",
  "location": { "name": "GX Porto, Porto, Portugal", "gmaps": "https://maps.app.goo.gl/..." },
  "page": "https://chess-results.com/...",
  "category": "Classic",
  "timeControl": "90m + 30s",
  "team": false,
  "rated": true,
  "ratingDiff": "+12.4",
  "performance": 1900,
  "numPlayers": 30,
  "rank": 5,
  "score": "5.0 / 7",
  "notes": "Optional comments about the tournament."
}
```

- `category` is `Classic`, `Rapid` or `Blitz`.
- The tournament is published at `/tournament/<name in lowercase, with dashes>/`.

To add its games, add one object per game to `data/games.json`. The `event` field must be the tournament's `name`. `result` is `white`, `black` or `draw`, and `view` is the color I played.

The build checks both files and fails on a missing or wrong field. It also makes each tournament's social preview image and sitemap entry.

## Ratings

The build reads the ratings when it runs:

- FIDE ratings and their monthly history come from my [FIDE profile](https://ratings.fide.com/profile/1962000).
- Lichess ratings come from the [Lichess API](https://lichess.org/api).

If a source is not available, the build still passes and the site says so.

## Deploy

- Build command: `npm run build`
- Output directory: `dist/`

`netlify.toml` sets both for Netlify. FIDE publishes new ratings once a month, so a GitHub Actions workflow (`.github/workflows/rebuild.yml`) rebuilds the site on the 2nd of each month. To turn it on:

1. In Netlify, open **Site configuration → Build & deploy → Build hooks** and add a hook.
2. In GitHub, add the hook URL as the `NETLIFY_BUILD_HOOK` repository secret.
