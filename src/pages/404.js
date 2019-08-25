import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";

const NotFoundPage = () => (
    <Layout>
        <SEO title="404: Not found" />
        <h2>Not found</h2>
        <p>
            The requested page does seem to exist. Please return to
            the <Link className="emphasized-anchor" to="/">home page</Link>.
        </p>
    </Layout>
);

export default NotFoundPage;
