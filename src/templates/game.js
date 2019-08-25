import React from "react";
import { graphql, Link } from "gatsby";

import Layout from "../components/layout";
import "../css/game.css";
import Board from "../components/board";

const prettifyPlayerData = (player) => {
    const name = prettifyPlayerName(player.name);

    if (player.elo === 0) {
        player.elo = "no elo";
    }

    return player.elo ? `${name} (${player.elo})` : name;
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

const isMissingGameData = (game) => (
    !game.white.name ||
    !game.black.name ||
    !game.event ||
    !game.date ||
    !game.pgn ||
    !game.result
);

const Game = ({ data }) => {
    const game = data.allSitePage.edges[0].node.context;

    if (isMissingGameData(game)) {
        return (
            <Layout>
                <h2>Game data missing</h2>
                <p>
                    It appears that the requested game's data is missing. Please return
                    to the <Link className="emphasized-anchor" to="/">home page</Link>.
                </p>
            </Layout>
        );
    }

    return (
        <Layout>
            <header className="game-header">
                <h2>
                    <span className="game-players">
                        {prettifyPlayerData(game.white)}
                        <span style={{ fontWeight: "normal" }}> vs </span>
                        {prettifyPlayerData(game.black)}
                    </span>
                    <span className="game-date">
                        {game.date}
                    </span>
                </h2>
                <p>
                    <strong>{game.event}</strong>
                    {game.round && <span>,&nbsp;&nbsp;Round <strong>{game.round}</strong></span>}
                </p>
                {game.table && game.white.club && game.black.club &&
                    <p>
                        <strong>{game.white.club}</strong>
                        <span> vs </span>
                        <strong>{game.black.club}</strong>
                        <span>,&nbsp;&nbsp;Table <strong>{game.table}</strong></span>
                    </p>
                }
            </header>

            <Board pgn={game.pgn} view={game.view} />
        </Layout>
    );
};

export const query = graphql`
  query($path: String!) {
    allSitePage(filter: { path: { eq: $path } }) {
      edges {
        node {
          context {
            pgn
            date
            event
            round
            table
            white {
              name
              elo
              club
            }
            black {
              name
              elo
              club
            }
            result
            view
          }
        }
      }
    }
  }
`;

export default Game;
