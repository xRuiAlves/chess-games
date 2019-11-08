import React from "react";
import { Link } from "gatsby";
import { parseShortDate } from "../utils/utils";
import { getPlayerHistory } from "../utils/api";

export default class Ratings extends React.Component {
    state = {};

    componentDidMount() {
        getPlayerHistory().then((res) => res.status === 200 && this.parseHistory(res.data));
    }

    parseHistory = (history) => {
        const current = history[0];
        const highest = history.reduce((prev, curr) => curr.standard > prev.standard ? curr : prev);

        this.setState({
            ratings: {
                current: {
                    elo: current.standard,
                    date: parseShortDate(current.numeric_date.toString(10)),
                },
                highest: {
                    elo: highest.standard,
                    date: parseShortDate(highest.numeric_date.toString(10)),
                },
            },
        });
    }

    render() {
        const { ratings } = this.state;

        return (
            <>
                <h2>Ratings</h2>
                {!ratings ?
                    <div>
                        Loading ...
                    </div> :
                    <>
                        <div style={{ marginBottom: "0.4em" }}>
                            <strong>Current Rating: </strong>&nbsp;{ratings.current.elo}, as of {ratings.current.date}
                        </div>
                        <div style={{ marginBottom: "1.5em" }}>
                            <strong>Highest Rating: </strong>&nbsp;{ratings.highest.elo}, as of {ratings.highest.date}
                        </div>
                        <div>
                            See my full ratings list{" "}
                            <Link className="emphasized-anchor" to={"/history"}>
                                here
                            </Link>.
                        </div>
                    </>
                }
            </>
        );
    }
}
