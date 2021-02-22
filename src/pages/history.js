import React from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../css/history-table.css";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { getLivePlayerHistory } from "../utils/api";

export default class History extends React.Component {
    state = {};

    componentDidMount() {
        getLivePlayerHistory()
            .then((res) => res.json())
            .then((res) => this.setState({ history: res }));
    }

    render() {
        const { history } = this.state;

        return (
            <Layout>
                <SEO title="Ratings History" />
                <h2>
                    Ratings History
                </h2>
                {!history ?
                    <div>
                            Loading ...
                    </div> :
                    <table id="ratings_history">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Standard</th>
                                <th>Rapid</th>
                                <th>Blitz</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history && history.map(({ date, standard, rapid, blitz }) =>
                                <tr key={date}>
                                    <td>
                                        {date}
                                    </td>
                                    <td>
                                        {standard}
                                    </td>
                                    <td>
                                        {rapid}
                                    </td>
                                    <td>
                                        {blitz}
                                    </td>
                                </tr>,
                            )}
                        </tbody>
                    </table>
                }
            </Layout>
        );
    }
}
