import { Response } from "express"
import bcrypt from "bcryptjs"
import { secret as jwtSecret} from "./jwt_strategy"
import { userDecodedJwtToken } from "./interfaces"
import { IncomingHttpHeaders } from "http"
import jwt from 'jsonwebtoken'

/**
 * Creates a standardized response, with the response code in params and a custom message forwarded via json
 * @param res 
 * @param status 
 * @param message 
 */
export function failRequest(res:Response, status: number, message: string): void {
    res.status(status).json({ message: message }) as any
}

/**
 * Returns a salted hashed version of the given password
 * @param password 
 * @returns {string}
 */
export async function hashPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export function decodeJwtToken(authHeader: IncomingHttpHeaders["authorization"]|string, secret: string = jwtSecret): userDecodedJwtToken {
    const reqToken = authHeader.slice(7);
    const decodedToken = jwt.verify(reqToken, secret) as userDecodedJwtToken;
    return decodedToken
}

/**
 * Checks if the user's id of the JWT token matches the provided user's id
 * @param authHeader 
 * @param id 
 * @returns {boolean}
 */
export function isUserIdFromTokenMatchingRequest(authHeader:IncomingHttpHeaders["authorization"]|string, id:number|string): boolean {

    if (!authHeader || !authHeader.startsWith('Bearer '))
        return false
    
    const reqUserId: number = decodeJwtToken(authHeader).id

    if (id !== reqUserId)
        return false

    return true
}