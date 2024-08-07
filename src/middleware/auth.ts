import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization

    if(!bearer) return res.status(401).json({error: "No Autorizado"})
    const [, token] = bearer.split(' ')
    
    try {
        jwt.verify(token, process.env.JWT_KEY)
        next()
    } catch (error) {
        return res.status(401).json({error: "Tu sesión ha expirado"})
    }
}