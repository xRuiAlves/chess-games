import React from "react";
import PropTypes from "prop-types";
import { saveAs } from "file-saver";
import "../css/export-tool.css";

const exportFEN = (fen, move_number) => {
    const file_content = new Blob([fen], { type: "text/plain;charset=utf-8" });
    const file_name = `move_${move_number}.fen`;
    saveAs(file_content, file_name);
};

const FENExportTool = ({ fen, move_number }) => (
    <span className="export-tool-button" onClick={() => exportFEN(fen, move_number)}>
        Export FEN
    </span>
);

FENExportTool.propTypes = {
    fen: PropTypes.string.isRequired,
    move_number: PropTypes.number.isRequired,
};

export default FENExportTool;
