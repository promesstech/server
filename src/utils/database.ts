/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, {
    Model,
    FilterQuery,
    AnyObject,
    AnyKeys,
} from "mongoose";

export const createDatabase = (connectionString: string) => {
    mongoose.connect(connectionString.replace(/"|'/, ""));

    const create = (collection: Model<any>, doc: AnyObject | AnyKeys<any>) => {
        return collection.create(doc);
    };

    const find = (collection: Model<any>, query: FilterQuery<any>, options?: {
        sort?: object;
        limit?: number;
    }) => {
        return collection.find(query).limit(options?.limit || 0);
    };

    const findOne = (collection: Model<any>, query: FilterQuery<any>, options?: {
        sort?: object;
        limit?: number;
    }) => {
        return collection.findOne(query).limit(options?.limit || 0);
    };

    const findById = (collection: Model<any>, id: string) => {
        return collection.findById(id);
    };

    const updateOne = (collection: Model<any>, query: FilterQuery<any>, doc: AnyObject) => {
        return collection.updateOne(query, doc);
    };

    const deleteOne = (collection: Model<any>, query: FilterQuery<any>) => {
        return collection.deleteOne(query);
    };

    return Object.freeze({
        create,
        find,
        findOne,
        findById,
        updateOne,
        deleteOne,
    });
};

export const disconnectFromDatabase = async () => {
    await mongoose.connection.close();
};

export const IdType = {
    type: String,
    required: true,
    unique: false,
};

export const UniqueIdType = {
    type: String,
    required: true,
    unique: true,
};

export const NameType = {
    type: String,
    required: true,
};