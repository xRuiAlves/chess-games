import React, { Component } from "react";
import PropTypes from "prop-types";

import "../css/board.css";
import PgnViewer from "./pgnViewer";

const buildBoard = () => {
    const board = [];
    for (let i = 1; i <= 8; ++i) {
        const row = [];
        for (let j = 1; j <= 8; j++) {
            row.push(`${i}${j}`);
        }
        board.push(row);
    }

    return board.map((row, i) => (
        <div className="board-row" id={`board_row_${i + 1}`} key={i}>
            {row.map((cell) => (
                <div className="board-cell" id={`board_cell_${cell}`} key={cell}>
                    {cell}
                </div>
            ))}
        </div>
    ));
};

class Board extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { pgn } = this.props;
        return (
            <>
                <div id="board_container">
                    <div id="board">
                        {buildBoard()}
                    </div>
                </div>
                <div id="pgn-container">
                    <PgnViewer pgn={pgn} />
                </div>
            </>
        );
    }
}

Board.propTypes = {
    pgn: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
};

export default Board;
