import {
    randomBytes,
    scryptSync,
    timingSafeEqual,
} from "crypto";

export const signup = (email: string, password: string): {
    email: string;
    password: string;
} => {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = scryptSync(password, salt, 64).toString("hex");

    return {
        email,
        password: `${salt}:${hashedPassword}`,
    };
};

export const login = (hashedPassword: string, password: string): boolean => {
    const [
        salt,
        key,
    ] = hashedPassword.split(":");
    const hashedBuffer = scryptSync(password, salt, 64);

    const keyBuffer = Buffer.from(key, "hex");
    return timingSafeEqual(hashedBuffer, keyBuffer);
};