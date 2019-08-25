import React, { Component } from "react";
import PropTypes from "prop-types";
import "../css/board.css";

const prettifyResult = (result) => {
    if (result === "white") {
        return "1 - 0, white wins";
    } else if (result === "black") {
        return "0 - 1, black wins";
    } else if (result === "draw") {
        return "½ - ½, draw";
    }
    return "";
};

class PgnViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { pgn_elems } = this.props;
        return (
            <div id="pgn_container" className="pgn-container">
                {pgn_elems}
                <div className="game-result">{prettifyResult(this.props.result)}</div>
            </div>
        );
    }
}

PgnViewer.propTypes = {
    pgn_elems: PropTypes.array.isRequired,
    result: PropTypes.string.isRequired,
};

export default PgnViewer;
