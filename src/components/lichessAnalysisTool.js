import React from "react";
import PropTypes from "prop-types";
import { buildPGNString } from "../utils/pgnBuilder";
import { importLichessGame } from "../utils/api";
import "../css/export-tool.css";

const printPGN = (props) => {
    const pgn = buildPGNString(props);

    importLichessGame(pgn)
        .then((res) => res.json())
        .then((res) => {
            if (res.url) {
                window.open(res.url, "_blank");
            } else {
                displayError();
            }
        })
        .catch((_err) => {
            displayError();
        });
};

const displayError = () => {
    window.alert("Failed to import game to Lichess, the service may be temporarily unavailable. Please try again later.");
};

const LichessAnalysisTool = (props) => (
    <span className="export-tool-button" onClick={() => printPGN(props)}>
        Analyse on Lichess
    </span>
);

LichessAnalysisTool.propTypes = {
    pgn: PropTypes.string.isRequired,
    white: PropTypes.object.isRequired,
    black: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
};

export default LichessAnalysisTool;
