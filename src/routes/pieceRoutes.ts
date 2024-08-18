import { Router } from 'express'
import { PieceController } from '../controllers/PieceController'
import { authenticateToken } from '../middleware/auth'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'

const router = Router()

router.post('/', 
    authenticateToken,
    body('name').notEmpty().withMessage('The name is required'),
    body('availability').notEmpty().withMessage('The avaliability is required'),
    body('category').notEmpty().withMessage('The category is required'),
    body('weight')
        .notEmpty().withMessage('The weight is required')
        .custom(v => v >= 0).withMessage('The weight must be greater or equal than 0'),
    body('caratage').notEmpty().withMessage('The caratage is required'),
    body('description').notEmpty().withMessage('The description is required'),
    body('measure')
        .notEmpty().withMessage('The measure is required')
        .custom(v => v >= 0).withMessage('The measure must be greater or equal than 0'),
    handleInputErrors,
    PieceController.addPiece
)

router.get('/', PieceController.getPieces)

router.get('/:pieceId',
    param('pieceId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    PieceController.getPieceById
)

router.put('/:pieceId', 
    authenticateToken, 
    param('pieceId').isMongoId().withMessage('Invalid ID'),
    body('name').notEmpty().withMessage('The name is required'),
    body('availability').notEmpty().withMessage('The avaliability is required'),
    body('category').notEmpty().withMessage('The category is required'),
    body('weight')
        .notEmpty().withMessage('The weight is required')
        .custom(v => v >= 0).withMessage('The weight must be greater or equal than 0'),
    body('caratage').notEmpty().withMessage('The caratage is required'),
    body('description').notEmpty().withMessage('The description is required'),
    body('measure')
        .notEmpty().withMessage('The measure is required')
        .custom(v => v >= 0).withMessage('The measure must be greater or equal than 0'),
    handleInputErrors,
    PieceController.updatePiece
)

router.delete('/:pieceId', 
    authenticateToken,
    param('pieceId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    PieceController.deletePiece
)

router.patch('/:pieceId/change-availability',
    authenticateToken,
    param('pieceId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    PieceController.changeAvailability
)

router.patch('/:pieceId/delete-image',
    authenticateToken,
    param('pieceId').isMongoId().withMessage('Invalid ID'),
    body('photo').notEmpty().withMessage('The photo is required'),
    handleInputErrors,
    PieceController.deleteImage
)

router.patch('/:pieceId/add-image',
    authenticateToken,
    param('pieceId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    PieceController.addImage
)

export default router