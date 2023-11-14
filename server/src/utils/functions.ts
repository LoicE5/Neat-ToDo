import { Response } from "express"

export function failRequest(res:Response, status: number, message: string): void {
    res.status(status).json({ message: message }) as any
}

export function isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}