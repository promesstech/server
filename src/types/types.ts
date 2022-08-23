export interface Avatar {
    id: string;
    url: string;
};

export interface User {
    id: string;
    name: string;
    avatar: Avatar;
    email: string;
};

export interface Role {
    id: string;
    name: string;
    level: "c-role" | "vice" | "manager" | "staff" | "beginner";
};

export interface Team {
    id: string;
    name: string;
};

interface ExtendedUser {
    roles: Role[];
    team: Team;
};

export interface Member extends User, ExtendedUser {};

export interface Member {
    name: string;
}

export interface PartialMessage {
    content: string;
    chatId: string;
    authorId: string;
};

export interface Message {
    id: string;
    content: string;
    // in the database it's saved as a string
    // but before we send it to the client we convert it to a number
    // or the client converts it in the array
    createdAt: number;
    authorId: string;
    author: User;
    chatId: string;
};

export interface Project {
    id: string;
    name: string;
};

export interface Organization {
    id: string;
    name: string;
    members: Member[];
    teams: Team[];
    projects: Project[];
    roles: Role[];
};

export interface Chat {
    id: string;
    name: string;
    organizationId: string;
};

export interface Task {
    id: string;
    createdBy: Member;
    createdAt: number;
    description: string;
    status: "todo" | "in-progress" | "testing" | "done"
    assignees: Member[];
    dueDate: number | "none";
    priority: "none" | "low" | "medium" | "high" | "urgent";
    team: Team;
    project: Project;
};