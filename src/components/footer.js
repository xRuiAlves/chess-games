import React, { Component } from "react";
import "../css/footer.css";

class Footer extends Component {
    componentDidMount() {
        const page_height = document.body.getBoundingClientRect().height;
        const viewport_height = window.innerHeight || document.documentElement.clientHeight || screen.height;
        document.getElementById("footer").style.top = `${Math.max(viewport_height, page_height) - 30}px`;
    }

    render() {
        return (
            <footer id="footer">
                © {new Date().getFullYear()}, made by Rui Alves
            </footer>
        );
    }
}

export default Footer;
