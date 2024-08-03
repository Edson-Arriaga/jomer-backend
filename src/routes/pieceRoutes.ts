import { Router } from 'express'
import { PieceController } from '../controllers/PieceController'
import { authenticateToken } from '../middleware/auth'

const router = Router()

router.post('/', authenticateToken, PieceController.addPiece)
router.get('/', PieceController.getPieces)
router.get('/:pieceId', PieceController.getPieceById)

export default router