import joi from "joi";

const validateUser = (user: {
    email: string;
    password: string;
}): string | undefined => {
    const userSchema = joi.object({
        email: joi
            .string()
            .email()
            .required(),
        password: joi
            .string()
            .min(8)
            .required(),
    });

    const { error } = userSchema.validate(user);

    if (error) return error.details.map(detail => detail.message).join("\n");
};

export default { validateUser };