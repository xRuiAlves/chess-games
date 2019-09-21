import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import "../css/game.css";
import SEO from "../components/seo";
import GamesList from "../components/gamesList";

const Event = ({ data }) => {
    const { event, games } = data.allSitePage.edges[0].node.context;

    return (
        <Layout>
            <SEO title={event} />
            <GamesList header={event} games={games} />
        </Layout>
    );
};

export const query = graphql`
  query($path: String!) {
    allSitePage(filter: { path: { eq: $path } }) {
      edges {
        node {
          context {
            event
            games {
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
  }
`;

export default Event;
