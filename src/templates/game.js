import React from "react";
import { graphql, Link } from "gatsby";

import Layout from "../components/layout";
import "../css/game.css";
import Board from "../components/board";
import { prettifyPlayerData } from "../utils.js";
import SEO from "../components/seo";

const isMissingGameData = (game) => (
    !game.white.name ||
    !game.black.name ||
    !game.event ||
    !game.date ||
    !game.pgn ||
    !game.view ||
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

    const white_name = prettifyPlayerData(game.white);
    const black_name = prettifyPlayerData(game.black);

    return (
        <Layout>
            <SEO title={`${white_name} vs ${black_name}`} />
            <header className="game-header">
                <h2>
                    <span className="game-players">
                        {game.white.title && `${game.white.title} `}{white_name}
                        <span style={{ fontWeight: "normal" }}> vs </span>
                        {game.black.title && `${game.black.title} `}{black_name}
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

            <Board {...game} />
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
              title
            }
            black {
              name
              elo
              club
              title
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
