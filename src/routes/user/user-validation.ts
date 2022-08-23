import { z } from "zod";

const validateNewUser = (user: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}) => {
    const UserSchema = z.object({
        name: z
            .string()
            .min(1),
        email: z
            .string()
            .email(),
        password: z
            .string()
            .min(8),
        confirmPassword: z
            .string()
            .min(8),
    });

    return UserSchema.safeParse(user);
};

export default Object.freeze({
    validateNewUser,
});