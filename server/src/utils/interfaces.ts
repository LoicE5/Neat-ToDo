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