import React from "react";
import PropTypes from "prop-types";
import { buildPGNString } from "../utils/pgnBuilder";
import { saveAs } from "file-saver";
import "../css/export-tool.css";

const exportPGN = (props) => {
    const { white, black, date } = props;

    const white_name = white.name.split(" ").join("");
    const black_name = black.name.split(" ").join("");
    const file_name = `${white_name}_vs_${black_name}_${date}.pgn`;

    const file_content = new Blob([buildPGNString(props)], { type: "text/plain;charset=utf-8" });
    saveAs(file_content, file_name);
};

const PGNExportTool = (props) => (
    <span className="export-tool-button" onClick={() => exportPGN(props)}>
        Export PGN
    </span>
);

PGNExportTool.propTypes = {
    pgn: PropTypes.string.isRequired,
    white: PropTypes.object.isRequired,
    black: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
};

export default PGNExportTool;
