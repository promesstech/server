export interface Organization {
    // org_id
    id: string;
    name: string;
    members: string[];
    roles: string[];
    teams: string[];
    tasks: string[];
    project: string[];
    files: string[];
    chats: string[];
    folders: string[];
};
export interface Chat {
    // chat_id
    id: string;
    name: string;
    organizationId: string;
    messages: string[];
};
export interface Message {
    // msg_id
    id: string;
    content: string;
    createdAt: number;
    chatId: string;
    authorId: string;
};
export interface Role {
    // role_id
    id: string;
    name: string;
    level: "ADMIN" | "USER";
    organizationId: string;
};
export interface User {
    // user_id
    id: string;
    name: string;
    email: string;
    password: string;
    members: string[];
};
export interface Member {
    // member_id
    id: string;
    name: string;
    userId: string;
    organizationId: string;
    teamId: string;
    roles: string[];
};
export interface Team {
    // team_id
    id: string;
    name: string;
    organizationId: string;
    members: string[];
};
export interface Project {
    // proj_id
    id: string;
    name: string;
    organizationId: string;
    tasks: string[];
};
export interface Task {
    // task_id
    id: string;
    name: string;
    projectId: string;
    assignees: string[];
};
export interface CalendarEvent {
    // evt_id
    id: string;
    date: number;
    allDay: boolean;
    title: string;
    people: string[];
};
export interface File {
    // file_id
    id: string;
    type: "image" | "text";
    name: string;
    extension: "png" | "jpg" | "txt";
    data: string;
    folderId: string;
};
export interface Folder {
    // folder_id
    id: string;
    name: string;
    organizationId: string;
    folderId: string;
    files: string[];
    folders: string[];
}
// export interface Session { id: string };