import React from "react";
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

        return (ratings ?
            <>
                <h2>Ratings</h2>
                <div style={{ marginBottom: "0.4em" }}>
                    <strong>Current Rating: </strong>&nbsp;{ratings.current.elo}, as of {ratings.current.date}
                </div>
                <div>
                    <strong>Highest Rating: </strong>&nbsp;{ratings.highest.elo}, as of {ratings.highest.date}
                </div>
            </> : null
        );
    }
}
