import React from "react";
import PropTypes from "prop-types";
import { saveAs } from "file-saver";
import "../css/export-tool.css";

const exportPGN = (pgn, white, black, date) => {
    const file_content = new Blob([pgn], { type: "text/plain;charset=utf-8" });
    const white_name = white.name.split(" ").join("");
    const black_name = black.name.split(" ").join("");
    const file_name = `${white_name}_vs_${black_name}_${date}.pgn`;
    saveAs(file_content, file_name);
};

const PGNExportTool = ({ pgn, white, black, date }) => (
    <span className="export-tool-button" onClick={() => exportPGN(pgn, white, black, date)}>
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
