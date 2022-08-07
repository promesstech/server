import joi from "joi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleValidationError = (schema: joi.Schema, data: any): string | undefined => {
    const { error } = schema.validate(data);

    if (error) return error.details.map(detail => detail.message).join("\n");
};