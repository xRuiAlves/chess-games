require("dotenv-flow").config();

module.exports = {
    siteMetadata: {
        title: "Rui Chess Games",
        description: "Chess classic games web app",
        author: "Rui Alves",
    },
    plugins: [
        "gatsby-plugin-react-helmet",
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "images",
                path: `${__dirname}/src/images`,
            },
        },
        "gatsby-transformer-sharp",
        "gatsby-plugin-sharp",
        {
            resolve: "gatsby-plugin-manifest",
            options: {
                name: "gatsby-starter-default",
                short_name: "starter",
                start_url: "/",
                background_color: "#663399",
                theme_color: "#663399",
                display: "minimal-ui",
                icon: "src/images/logo.png", // This path is relative to the root of the site.
            },
        },
        {
            resolve: "gatsby-plugin-google-analytics",
            options: {
                trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
            },
        },
    ],
};
