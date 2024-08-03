import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if(!bearer){
        const error = new Error('No Autorizado')
        return res.status(401).json({error: error.message})
    }

    //Split the string because bearer is this: "Barear <token>"
    const [, token] = bearer.split(' ')
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        if(typeof decoded === 'object' && !decoded.authenticated){
            const error = new Error('No Autorizado')
            return res.status(401).json({error: error.message})
        }
        next()
    } catch (error) {
        return res.status(401).json({error: "No autorizado"})
    }
}