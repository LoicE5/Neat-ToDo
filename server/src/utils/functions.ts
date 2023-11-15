import { Response } from "express"

/**
 * Creates a standardized response, with the response code in params and a custom message forwarded via json
 * @param res 
 * @param status 
 * @param message 
 */
export function failRequest(res:Response, status: number, message: string): void {
    res.status(status).json({ message: message }) as any
}