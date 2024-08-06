import { Router } from 'express'
import { PieceController } from '../controllers/PieceController'
import { authenticateToken } from '../middleware/auth'

const router = Router()

router.post('/', authenticateToken, PieceController.addPiece)
router.get('/', PieceController.getPieces)
router.get('/:pieceId', PieceController.getPieceById)
router.put('/:pieceId', authenticateToken ,PieceController.updatePiece)
router.delete('/:pieceId', authenticateToken ,PieceController.deletePiece)

export default router