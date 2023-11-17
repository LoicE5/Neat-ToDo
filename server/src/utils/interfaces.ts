export interface userCreationPayload {
    nickname: string,
    email: string,
    password: string
}

export interface userUpdatePayload {
    nickname?: string,
    email?: string,
    password?: string
}

export interface jwtPayload {
    id:number
}

export interface userDecodedJwtToken {
    id: number, 
    iat: number
}

export interface todoCreatePayload{
    group_id?:number,
    title:string,
    description?:string,
    deadline?:Date,
    status?:string,
    assignee_id: number,
    author_id:number
}

export interface todoUpdatePayload{
    title?:string,
    description?:string,
    deadline?:Date,
    status?:string,
    assignee_id?: number,
}