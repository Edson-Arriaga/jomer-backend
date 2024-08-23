import { NextFunction, Request, Response } from "express"
import Piece, { IPiece } from "../models/Piece"

declare global {
    namespace Express {
        interface Request {
            piece: IPiece
        }
    }
}

export const pieceExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { pieceId } = req.params
        const piece = await Piece.findById(pieceId)
            
        if(!piece){
            const error = new Error('Pieza no encontrada')
            return res.status(404).json({error: error.message})
        }
        
        req.piece = piece 
        next()
    } catch (error) {
        res.status(500).json({error: 'An error ocurred'})
    }
}