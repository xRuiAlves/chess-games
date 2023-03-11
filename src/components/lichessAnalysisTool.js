import React from "react"
import PropTypes from "prop-types"
import "../css/export-tool.css"

const LichessAnalysisTool = ({ lichess_url }) => (
  <span
    className="export-tool-button"
    onClick={() => window.open(lichess_url, "_blank")}
  >
    Analyse on Lichess
  </span>
)

LichessAnalysisTool.propTypes = {
  lichess_url: PropTypes.string.isRequired,
}

export default LichessAnalysisTool
