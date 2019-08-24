import React from "react";
import Layout from "../components/layout";
import { graphql } from "gatsby";

const Game = ({ data }) => {
    const game = data.allSitePage.edges[0].node.context;
    return (
        <Layout>
            Hello
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
          }
        }
      }
    }
  }
`;

export default Game;
