const env = process.env.NODE_ENV || "development";
// websiteUrl: env === "development" ? "http://localhost:1337" : "https://promess.netlify.app",
export default {
    "core": {
        "PORT": process.env.PORT || 3001,
        env,
        prod: env === "production",
        dev: env === "development",
        websiteUrl: [
            "http://localhost:1337",
            "https://promess.netlify.app",
            "https://promess.tech",
        ],
        serverUrl: "http://localhost:50451",
    },
    "auth": {
        "encryptSecret": process.env.ENCRYPT_SECRET || "secret",
        "google": {
            "clientId": process.env.AUTH_GOOGLE_CLIENT_ID || "",
            "clientSecret": process.env.AUTH_GOOGLE_CLIENT_SECRET || "",
            "callbackUrl": "http://localhost:50451/v1/user/auth/google/callback",
        },
    },
};