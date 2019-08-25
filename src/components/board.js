import React, { Component } from "react";
import PropTypes from "prop-types";

import "../css/board.css";
import PgnViewer from "./pgnViewer";
import Chess from "chess.js";

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
                <div className="board-cell" id={`board_cell_${cell}`} key={cell} type="none" />
            ))}
        </div>
    ));
};

const drawBoardFromFen = (fen, reversed_view) => {
    fen = fen.split(" ")[0];
    const parsed_fen = parseFen(fen);

    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            const cell_id = `board_cell_${i + 1}${j + 1}`;
            const parsed_fen_index = reversed_view ? (63 - ((i * 8) + j)) : ((i * 8) + j);
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
            move_number: 0,
            status: "ok",
            fens: [],
        };
    }

    componentDidMount() {
        const chess = new Chess();
        const success = chess.load_pgn(this.props.pgn);
        const reversed_view = this.props.view === "black";

        if (!success) {
            this.setState({ status: "error" });
            return;
        }

        const fens = [];
        while (chess.history().length > 0) {
            fens.unshift(parseFen(chess.fen()));
            chess.undo();
        }
        fens.unshift(parseFen(chess.fen()));

        this.setState({
            fens,
            reversed_view,
        });

        drawBoardFromFen(fens[0], reversed_view);
    }

    gotoFirstMove = () => {
        this.setState({ move_number: 0 }, this.drawBoard);
    }

    gotoPrevMove = () => {
        if (this.state.move_number > 0) {
            this.setState({ move_number: this.state.move_number - 1 }, this.drawBoard);
        }
    }

    gotoNextMove = () => {
        if (this.state.move_number < this.state.fens.length - 1) {
            this.setState({ move_number: this.state.move_number + 1 }, this.drawBoard);
        }
    }

    gotoLastMove = () => {
        this.setState({ move_number: this.state.fens.length - 1 }, this.drawBoard);
    }

    drawBoard = () => {
        const { fens, move_number, reversed_view } = this.state;
        drawBoardFromFen(fens[move_number], reversed_view);
    }

    render() {
        return (this.state.status === "ok" ?
            <>
                <div id="board_container">
                    <div id="board">
                        {buildBoard()}
                    </div>
                </div>
                <button onClick={this.gotoFirstMove}>{"<<<"}</button>
                <button onClick={this.gotoPrevMove}>{"<-"}</button>
                <button onClick={this.gotoNextMove}>{"->"}</button>
                <button onClick={this.gotoLastMove}>{">>>"}</button>
                <br /><br />
                <div id="pgn-container">
                    <PgnViewer pgn={this.props.pgn} />
                </div>
            </>
            :
            <>
                Error
            </>
        );
    }
}

Board.propTypes = {
    pgn: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
};

export default Board;
