import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import { parseShortDate } from "../utils/utils";
import { getLivePlayerHistory, getLichessRatings } from "../utils/api";

const LICHESS_PROFILE_URL = "https://lichess.org/@";

const Ratings = () => {
    const [liveRatings, setLiveRatings] = useState(null);
    const [liveRatingsLoading, setLiveRatingsLoading] = useState(true);
    const [liveRatingsError, setLiveRatingsError] = useState(false);
    const [lichessRatings, setLichessRatings] = useState(null);
    const [lichessRatingsLoading, setLichessRatingsLoading] = useState(true);
    const [lichessRatingsError, setLichessRatingsError] = useState(false);

    useEffect(() => {
        getLivePlayerHistory()
            .then((res) => {
                const history = res.data;
                const current = history[0];
                const highest = history.reduce((prev, curr) => curr.standard > prev.standard ? curr : prev);
                setLiveRatings({
                    current: {
                        elo: current.standard,
                        date: parseShortDate(current.numeric_date.toString(10)),
                    },
                    highest: {
                        elo: highest.standard,
                        date: parseShortDate(highest.numeric_date.toString(10)),
                    },
                });
                setLiveRatingsLoading(false);
            })
            .catch((_err) => {
                setLiveRatingsLoading(false);
                setLiveRatingsError(true);
            });

        getLichessRatings()
            .then(({ data }) => {
                setLichessRatings({
                    id: data.id,
                    username: data.username,
                    blitz: data.perfs.blitz.rating,
                    rapid: data.perfs.rapid.rating,
                    classical: data.perfs.classical.rating,
                    correspondence: data.perfs.correspondence.rating,
                    puzzle: data.perfs.puzzle.rating,
                });
                setLichessRatingsLoading(false);
            })
            .catch((_err) => {
                setLichessRatingsLoading(false);
                setLichessRatingsError(true);
            });
    }, []);

    return (
        <div>
            <section className="grid-list ratings">
                <div>
                    <h2>Online Lichess Ratings</h2>
                    {lichessRatingsLoading ?
                        <div>
                            Loading ...
                        </div> :
                        <>
                            {lichessRatingsError ?
                                <div>
                                Failed to fetch Lichess ratings.
                                </div> :
                                <>
                                    <div style={{ marginBottom: "0.4em" }}>
                                        <strong>Nickname: </strong>
                                        <a className="lichess-id"href={`${LICHESS_PROFILE_URL}/${lichessRatings.id}`}>
                                        @{lichessRatings.username}
                                        </a>
                                    </div>
                                    <div style={{ marginBottom: "0.4em" }}>
                                        <strong>Blitz: </strong>{lichessRatings.blitz}
                                    </div>
                                    <div style={{ marginBottom: "0.4em" }}>
                                        <strong>Rapid: </strong>{lichessRatings.rapid}
                                    </div>
                                    <div style={{ marginBottom: "0.4em" }}>
                                        <strong>Classical: </strong>{lichessRatings.classical}
                                    </div>
                                    <div style={{ marginBottom: "0.4em" }}>
                                        <strong>Correspondence: </strong>{lichessRatings.correspondence}
                                    </div>
                                    <div style={{ marginBottom: "0.4em" }}>
                                        <strong>Puzzles: </strong>{lichessRatings.puzzle}
                                    </div>
                                </>
                            }
                        </>
                    }
                </div>
                <div>
                    <h2>Live Ratings</h2>
                    {liveRatingsLoading ?
                        <div>
                            Loading ...
                        </div> :
                        <>
                            {liveRatingsError ?
                                <div>
                                Failed to fetch live ratings.
                                </div> :
                                <>
                                    <div style={{ marginBottom: "0.4em" }}>
                                        <strong>Current: </strong>{liveRatings.current.elo}, as of {liveRatings.current.date}
                                    </div>
                                    <div style={{ marginBottom: "0.4em" }}>
                                        <strong>Highest: </strong>{liveRatings.highest.elo}, as of {liveRatings.highest.date}
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
                    }
                </div>
            </section>
        </div>
    );
};

export default Ratings;
