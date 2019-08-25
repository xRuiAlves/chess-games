import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Welcome from "../components/welcome";
import GamesList from "../components/gamesList";

const IndexPage = () => (
    <Layout>
        <SEO title="Home" />
        <Welcome />
        <GamesList />
    </Layout>
);

export default IndexPage;
