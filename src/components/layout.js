import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";

import Header from "./header";
import "../css/layout.css";
import "../css/common.css";
import Footer from "./footer";

const Layout = ({ children }) => {
    const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

    return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <div className="page-content">
          <main>{children}</main>
          <Footer />
      </div>
    </>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
