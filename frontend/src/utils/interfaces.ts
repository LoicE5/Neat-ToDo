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