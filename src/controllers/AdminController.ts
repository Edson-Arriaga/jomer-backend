import { Request, Response } from "express"
import jwt from "jsonwebtoken"

export class AdminController {
    static login = async (req: Request, res: Response) => {
        try {
            const { password } = req.body
            if (password !== process.env.AUTH_PASSWORD){
                const error = new Error('Contraseña incorrecta')
                return res.status(400).json({error: error.message})
            }

            const accessToken = jwt.sign({ authenticated: true }, process.env.JWT_KEY, {expiresIn: '3h'})
            res.send(accessToken)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }
}