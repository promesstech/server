declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            DATABASE_CONNECTION_STRING: string;
            DISCORD_CLIENT_ID: string;
            DISCORD_CLIENT_SECRET: string;
            STRIPE_SECRET: string;
            STRIPE_PUBLIC: string
            AUTH_ENCRYPT_SECRET: string;
            AUTH_SESSION_SECRET: string;
        }
    }
}

export {};