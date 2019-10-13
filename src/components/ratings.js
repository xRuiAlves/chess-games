import React from "react";
import ratings from "../../ratings.json";

const Ratings = () => (
        <>
            <h2>Ratings</h2>
            <div style={{ marginBottom: "0.4em" }}>
                <strong>Standard Rating: </strong>&nbsp;{ratings.rating}, as of {ratings.rating_date}
            </div>
            <div>
                <strong>Highest Rating: </strong>&nbsp;{ratings.highest_rating}, as of {ratings.highest_rating_date}
            </div>
        </>
);

export default Ratings;
