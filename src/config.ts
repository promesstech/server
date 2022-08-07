const env = process.env.NODE_ENV || "development";
const websiteUrl = env === "development" ? "http://localhost:1337" : "https://discord-alertbot.netlify.app";

export default {
    "core": {
        "PORT": process.env.PORT || 3001,
        env,
        websiteUrl,
    },
    "database": { connectionString: process.env.DATABASE_CONNECTION_STRING || "" },
};