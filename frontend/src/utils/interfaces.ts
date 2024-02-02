import { TodoStatus } from './enums'

export interface loginResponse {
    message: string,
    token: string,
    user: userGetResponse
}

export interface userGetResponse {
    email: string,
    id: number,
    nickname:string
}

export interface groupGetResponse {
    id: number,
    name: string
}

export interface todoGetResponse {
    id: number,
    group_id?: number,
    title: string,
    description?: string,
    deadline?: string|Date,
    status: TodoStatus,
    assignee_id: number,
    author_id: number,
    createdAt: string|Date,
    updatedAt: string | Date,
    assignee: userGetResponse|null,
    author: userGetResponse|null,
    group: groupGetResponse|null
}

export interface userGroupGetResponse {
    id: number,
    name: string,
    userCount: number,
    Users: userGetResponse[],
    UserGroup: {
        UserId: number,
        GroupId: number
    }
}