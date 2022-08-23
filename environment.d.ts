declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            DATABASE_URL: string;
            NODE_ENV: "development" | "production";
            ENCRYPT_SECRET: string;
        }
    }
}

export {};