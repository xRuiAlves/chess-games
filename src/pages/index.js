import React from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

import Layout from "../components/layout";
import SEO from "../components/seo";
import Welcome from "../components/welcome";
import EventsList from "../components/eventsList";

config.autoAddCss = false;

const IndexPage = () => (
    <Layout>
        <SEO title="Home" />
        <Welcome />
        <EventsList />
    </Layout>
);

export default IndexPage;
