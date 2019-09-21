import React from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Welcome from "../components/welcome";
import GamesList from "../components/gamesList";

config.autoAddCss = false;

const IndexPage = () => (
    <Layout>
        <SEO title="Home" />
        <Welcome />
        <GamesList />
    </Layout>
);

export default IndexPage;
