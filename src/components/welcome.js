import React from "react";

const Welcome = () => (
        <>
            <h2>Welcome!</h2>
            <p>
                My name is <strong>Rui Alves</strong> and I'm a chess player
                from <a className="emphasized-anchor" href="http://www.gxp.pt">Grupo de Xadrez do Porto</a>.
            </p>
            <p style={{ marginBottom: "0.3em" }}>
                In this website you can find a collection of all my classical games throughout my
                "chess career".
            </p>
            <p>
                If you wish to reach out to me to play some games, feel free to do it
                via <a className="emphasized-anchor" href="mailto:ruialves.esrt.98@gmail.com">my email</a>.
            </p>
        </>
);

export default Welcome;
