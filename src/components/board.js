import React, { Component } from "react";
import PropTypes from "prop-types";
import "../css/board.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt, faChevronLeft, faChevronRight, faFastBackward, faFastForward } from "@fortawesome/free-solid-svg-icons";
import PgnViewer from "./pgnViewer";
import Chess from "chess.js";
import { Link } from "gatsby";
import PGNExportTool from "./pgnExportTool";
import FENExportTool from "./fenExportTool";

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

const getSquareNumber = (move, reversed_view) => {
    const i = parseInt(move[1], 10) - 1;
    const j = move.charCodeAt(0) - "a".charCodeAt(0) + 1;

    return reversed_view ? `${i + 1}${(8 - j) + 1}` : `${(8 - i)}${j}`;
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

const updateHighlightedMove = (move_number) => {
    const pgn_elems = document.getElementById("pgn_container").children;
    for (const pgn_elem of pgn_elems) {
        pgn_elem.children[1] && pgn_elem.children[1].removeAttribute("highlighted");
        pgn_elem.children[2] && pgn_elem.children[2].removeAttribute("highlighted");
    }
    const move = document.querySelector(`.pgn-move[move=m${move_number}]`);
    move && fixScroll(move);
    move && move.setAttribute("highlighted", true);
};

const fixScroll = (move_node) => {
    const pgn_container = document.getElementById("pgn_container");
    const container_rect = pgn_container.getBoundingClientRect();
    const move_node_rect = move_node.getBoundingClientRect();

    if (move_node_rect.top > container_rect.top + container_rect.height) {
        pgn_container.scrollTo(0,
            (move_node_rect.top + pgn_container.scrollTop + move_node_rect.height) - (container_rect.top + container_rect.height),
        );
    } else if (move_node_rect.top < container_rect.top) {
        pgn_container.scrollTo(0,
            move_node_rect.top + pgn_container.scrollTop - container_rect.top - 3,
        );
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

const setUrlMoveNumber = (move_number, num_moves) => {
    if (history.pushState) {
        const move = Math.max(0, Math.min(move_number, num_moves));
        const query_params = move > 0 ? `?move=${move}` : "";
        const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}${query_params}`;
        window.history.pushState({ path: url }, "", url);
    }
};

class Board extends Component {
    constructor(props) {
        super(props);

        this.state = {
            move_number: 0,
            status: "ok",
            fens: [],
            raw_fens: [],
            pgn_elems: [],
            history: [],
            highlighted_squares: [],
        };
    }

    keyNavigationListener = (event) => {
        event.keyCode === 37 && this.gotoPrevMove();
        event.keyCode === 39 && this.gotoNextMove();
    }

    componentDidMount() {
        document.addEventListener("keydown", this.keyNavigationListener);

        const chess = new Chess();
        const success = chess.load_pgn(this.props.pgn);
        const reversed_view = this.props.view === "black";

        this.setState({
            history: chess.history({ verbose: true }),
        });

        if (!success) {
            this.setState({ status: "error" });
            return;
        }

        const pgn_moves = chess.history().map((move, i) => (
            <div
                className="pgn-move"
                key={i}
                move={`m${i + 1}`}
                onClick={() => this.updateMoveNumber(i + 1)}
            >
                {move}
            </div>
        ));

        const pgn_elems = [];
        for (let i = 0; i < pgn_moves.length / 2; ++i) {
            pgn_elems.push(
                <div className="pgn-elem" key={i}>
                    <div className="pgn-elem-num">{i + 1}</div>
                    {pgn_moves[2 * i]}
                    {pgn_moves[(2 * i) + 1] ||  <div className="pgn-move" />}
                </div>,
            );
        }

        const fens = [];
        const raw_fens = [];
        while (chess.history().length > 0) {
            fens.unshift(parseFen(chess.fen()));
            raw_fens.unshift(chess.fen());
            chess.undo();
        }
        fens.unshift(parseFen(chess.fen()));
        raw_fens.unshift(chess.fen());

        const move = new URLSearchParams(window.location.search).get("move");
        let move_number = 0;
        if (move && !isNaN(move)) {
            const num_moves = fens.length - 1;
            move_number = Math.max(0, Math.min(parseInt(move, 10), num_moves));
        }

        this.setState({
            fens,
            raw_fens,
            reversed_view,
            pgn_elems,
            move_number,
        }, () => this.updateMoveNumber(move_number));
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyNavigationListener);
    }

    updateMoveNumber = (move_number) => {
        setUrlMoveNumber(move_number, this.state.fens.length - 1);
        this.setState({ move_number }, this.drawBoard);
    }

    gotoFirstMove = () => {
        this.updateMoveNumber(0);
        document.getElementById("pgn_container").scrollTo(0, 0);
    }

    gotoPrevMove = () => {
        if (this.state.move_number > 0) {
            this.updateMoveNumber(this.state.move_number - 1);
        }
    }

    gotoNextMove = () => {
        if (this.state.move_number < this.state.fens.length - 1) {
            this.updateMoveNumber(this.state.move_number + 1);
        }
    }

    gotoLastMove = () => {
        this.updateMoveNumber(this.state.fens.length - 1);
    }

    swapView = () => {
        this.setState({ reversed_view: !this.state.reversed_view }, this.drawBoard);
    }

    drawBoard = () => {
        const { fens, move_number, reversed_view, history } = this.state;
        drawBoardFromFen(fens[move_number], reversed_view);
        this.updateHighlightedSquares(history[move_number - 1], reversed_view);
        updateHighlightedMove(move_number);
    }

    updateHighlightedSquares = (move, reversed_view) => {
        const { highlighted_squares, move_number } = this.state;
        while (highlighted_squares.length > 0) {
            highlighted_squares.pop().removeAttribute("highlighted");
        }

        if (move_number === 0) return;

        highlighted_squares.push(document.getElementById(`board_cell_${getSquareNumber(move.from, reversed_view)}`));
        highlighted_squares.push(document.getElementById(`board_cell_${getSquareNumber(move.to, reversed_view)}`));

        highlighted_squares.forEach((square) => square.setAttribute("highlighted", true));
    };

    render() {
        const { status, pgn_elems, raw_fens, move_number } = this.state;
        return (status === "ok" ?
            <div>
                <div id="game_data">
                    <div>
                        <div id="board_container">
                            <div id="board">
                                {buildBoard()}
                            </div>
                        </div>
                        <div id="game_controls">
                            <div className="board-control-button" onClick={this.gotoFirstMove}>
                                <FontAwesomeIcon icon={faFastBackward}  />
                            </div>
                            <div className="board-control-button" onClick={this.gotoPrevMove}>
                                <FontAwesomeIcon icon={faChevronLeft}  />
                            </div>
                            <div className="board-control-button" onClick={this.gotoNextMove}>
                                <FontAwesomeIcon icon={faChevronRight}  />
                            </div>
                            <div className="board-control-button" onClick={this.gotoLastMove}>
                                <FontAwesomeIcon icon={faFastForward}  />
                            </div>
                            <div className="board-control-button" onClick={this.swapView}>
                                <FontAwesomeIcon icon={faSyncAlt}  />
                            </div>
                        </div>
                    </div>
                    <div id="pgn-container">
                        <PgnViewer pgn_elems={pgn_elems} result={this.props.result} />
                    </div>
                </div>
                <div className="export-tools">
                    <PGNExportTool {...this.props} />
                    <FENExportTool fen={raw_fens[move_number] || ""} move_number={move_number} />
                </div>
            </div>
            :
            <p style={{ marginTop: "3em" }}>
                It appears that the requested game is corrupted or missing. Please return
                to the <Link className="emphasized-anchor" to="/">home page</Link>.
            </p>
        );
    }
}

Board.propTypes = {
    pgn: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
    white: PropTypes.object.isRequired,
    black: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
};

export default Board;
