import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import "../css/header.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChess } from "@fortawesome/free-solid-svg-icons";

const Header = ({ siteTitle }) => (
    <header>
        <h1>
            <Link to="/">
                {siteTitle}
                <FontAwesomeIcon icon={faChess} className="header-icon" />
            </Link>
        </h1>
    </header>
);

Header.propTypes = {
    siteTitle: PropTypes.string,
};

export default Header;
