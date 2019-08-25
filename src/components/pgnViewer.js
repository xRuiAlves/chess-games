import React, { Component } from "react";
import PropTypes from "prop-types";

class PgnViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { pgn } = this.props;
        return (
            <>
                {pgn}
            </>
        );
    }
}

PgnViewer.propTypes = {
    pgn: PropTypes.string.isRequired,
};

export default PgnViewer;
