import React, { Component } from "react";
import PropTypes from "prop-types";

import "../css/board.css";
import PgnViewer from "./pgnViewer";

const FEN_CHAR_TO_TYPE = {
    "p": "black-pawn",
    "n": "black-knight",
    "b": "black-bishop",
    "r": "black-rook",
    "q": "black-queen",
    "k": "black-king",
    "P": "white-pawn",
    "N": "white-knight",
    "B": "white-bishop",
    "R": "white-rook",
    "Q": "white-queen",
    "K": "white-king",
    "_": "none",
};

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
                <div className="board-cell" id={`board_cell_${cell}`} key={cell} type="none"></div>
            ))}
        </div>
    ));
};

const drawBoardFromFen = (fen, reversed) => {
    fen = fen.split(" ")[0];
    const parsed_fen = parseFen(fen);

    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            const cell_id = `board_cell_${i + 1}${j + 1}`;
            const parsed_fen_index = reversed ? (63 - ((i * 8) + j)) : ((i * 8) + j);
            document.getElementById(cell_id).setAttribute("type", FEN_CHAR_TO_TYPE[parsed_fen[parsed_fen_index]]);
        }
    }
};

const parseFen = (fen) => {
    const parsed_fen = [];

    for (const cell of fen) {
        if (cell === "/") {
            continue;
        }

        const num_empty_cells = parseInt(cell, 10);
        if (!isNaN(num_empty_cells)) {
            for (let i = 0; i < num_empty_cells; ++i) {
                parsed_fen.push("_");
            }
        } else {
            parsed_fen.push(cell);
        }
    }

    return parsed_fen.join("");
};

class Board extends Component {
    constructor(props) {
        super(props);

        this.state = {
            move_number: 1,
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        };
    }

    componentDidMount() {
        drawBoardFromFen(this.state.fen, this.props.view === "black");
    }

    render() {
        return (
            <>
                <div id="board_container">
                    <div id="board">
                        {buildBoard()}
                    </div>
                </div>
                <div id="pgn-container">
                    <PgnViewer pgn={this.props.pgn} />
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
