import {
    IdType,
    UniqueIdType,
    NameType,
} from "../../utils/database";
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    model,
    Schema,
} from "mongoose";

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    avatar: {
        id: string;
        url: string;
    };
    createdAt: number;
};

interface Role {
    id: string;
    name: string;
};

export interface Organization {
    id: string;
    name: string;
    members: (User & { role: Role })[];
    createdAt: number;
};

interface Session {
    id: string;
    expiresAt: number;
    data: string;
};

const OrganizationMemberType = {
    type: {
        id: IdType,
        name: NameType,
        role: {
            type: {
                id: IdType,
                name: NameType,
            },
            required: true,
        },
    },
    required: true,
};

export const UserType = {
    id: UniqueIdType,
    name: NameType,
    password: NameType,
    email: NameType,
    avatar: {
        id: UniqueIdType,
        url: NameType,
    },
    createdAt: {
        type: Number,
        required: true,
    },
};

export const OrganizationType = {
    id: UniqueIdType,
    name: NameType,
    members: [ OrganizationMemberType ],
    createdAt: {
        type: Number,
        required: true,
    },
};

export const RoleType = {
    id: UniqueIdType,
    name: NameType,
};

export const SessionType = {
    id: UniqueIdType,
    expiresAt: {
        type: Number,
        required: true,
    },
    data: {
        type: String,
        required: true,
    },
};

const userSchema = new Schema<User>(UserType);
const organizationSchema = new Schema<Organization>(OrganizationType);
const roleSchema = new Schema<Role>(RoleType);
const sessionSchema = new Schema<Session>(SessionType);

const userCollection = model<User>("user", userSchema);
const organizationCollection = model<Organization>("organization", organizationSchema);
const roleCollection = model<Role>("role", roleSchema);
const sessionCollection = model<Session>("session", sessionSchema);

const createUser = async (user: User): Promise<User> => {
    const newUser = await userCollection.create(user);
    return newUser;
};

const createOrganization = async (organization: Organization): Promise<Organization> => {
    const newOrganization = await organizationCollection.create(organization);
    return newOrganization;
};

const createRole = async (role: Role): Promise<Role> => {
    const newRole = await roleCollection.create(role);
    return newRole;
};

const createSession = async (session: Session): Promise<Session> => {
    const newSession = await sessionCollection.create(session);
    return newSession;
};

const getUser = async (id: string): Promise<User | null> => {
    const user = await userCollection.findOne({ id });
    return user;
};

const getUsers = async (ids: string[]): Promise<User[]> => {
    // is this the best way to do things?
    const usersPromises: any[] = [];
    ids.forEach(id => {
        if (!id) return;
        const user = userCollection.findOne({ id });
        usersPromises.push(user);
    });

    // await in loops is bad so I use Promise.all() outside of the loop instead
    const users = await Promise.all(usersPromises);

    return users;
};

const getUserByEmail = async (email: string): Promise<User | null> => {
    const user = await userCollection.findOne({ email });
    return user;
};

const getOrganization = async (id: string): Promise<Organization | null> => {
    const organization = await organizationCollection.findOne({ id });
    return organization;
};

const getSession = async (id: string): Promise<Session | null> => {
    const session = await sessionCollection.findOne({ id });
    return session;
};

export default Object.freeze({
    createUser,
    createOrganization,
    createRole,
    createSession,
    getUser,
    getUsers,
    getUserByEmail,
    getOrganization,
    getSession,
});