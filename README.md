# Chess Games

Static web app featuring all chess events I ever took part in.

Visit and watch my games [here](https://chess.rui-alves.me).

## Project setup

To setup the project, install dependencies:

```
npm install
```

To run the project locally:

```
gatsby develop
```

## Live ratings

The **Online Lichess Ratings** are fetched from the [Lichess API](https://lichess.org/api)

The **FIDE Live Ratings** are fetched using my [fide-ratings-lambda](https://github.com/xRuiAlves/fide-ratings-lambda) project, which is an AWS Lambda function wrapper for my [fide-ratings-scraper](https://github.com/xRuiAlves/fide-ratings-scraper) project.
