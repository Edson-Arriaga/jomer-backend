import { Request, Response } from "express"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import sharp from "sharp"
import { PieceBodyType, PieceUpdateBodyType } from "../types"
import app from "../config/firebaseConfig";
import Piece from "../models/Piece";

const storage = getStorage(app, "gs://jomer-ba42e.appspot.com");

export class PieceController {
    static addPiece = async (req: Request<{}, {}, PieceBodyType>, res: Response) => {
        try {
            const piece = await Piece.findOne({name: req.body.name})

            if(piece){
                const error = new Error('Ya existe una pieza con ese nombre.')
                return res.status(400).json({error: error.message})
            }

            const files = req.files['photos[]'];
            const fileArray = Array.isArray(files) ? files : [files];
            
            if(fileArray.length === 0 || fileArray.length > 5){
                const error = new Error('Sube de 1 a 5 fotos.')
                return res.status(400).json({error: error.message})
            }

            for(const file of fileArray) {
                const {width, height} = await sharp(file.data).metadata();
                if(width !== height){
                    const error = new Error('Las imagenes deden ser cuadradas.')
                    return res.status(400).json({error: error.message})
                }
            }

            let photos : string[] = []

            await Promise.all(fileArray.map(async(file, i) => {
                const imageWebp = await sharp(file.data)
                .toFormat("webp", {quality: 80})
                .toBuffer()
                
                const webpFileName = `${req.body.name}_${i}.webp`
                const storageRef = ref(storage, `${req.body.name}/${webpFileName}`);
                
                await uploadBytes(storageRef, imageWebp, { contentType: "image/webp" });
                
                const downloadURL = await getDownloadURL(storageRef);
                
                photos.push(downloadURL)
            }))
            
            Piece.create({...req.body, photos})    

            res.send('Pieza Añadida Correctamente');
            
        } catch (error) {
            return res.status(500).json({error: error.message})  
        }
    }

    static getPieces = async (req: Request, res: Response) => {
        try {
            const pieces = await Piece.find({})
            res.send(pieces)
        } catch (error) {
            res.send(error);   
        }
    }

    static getPieceById = async (req: Request, res: Response) => {
        try {
            const { pieceId } = req.params
            const piece = await Piece.findById(pieceId)
            if(!piece){
                const error = new Error('Pieza no encontrada')
                return res.status(404).json({error: error.message})
            }
            res.send(piece)

        } catch (error) {
            res.send(error.message)
        }
    }

    static updatePiece = async (req: Request<{pieceId: string}, {}, PieceUpdateBodyType>, res: Response) => {
        try {
            const { pieceId } = req.params
            const piece = await Piece.findById(pieceId)
                
            if(!piece){
                const error = new Error('Pieza no encontrada')
                return res.status(404).json({error: error.message})
            }

            const { 
                name, 
                availability, 
                caratage, 
                category, 
                description, 
                measure, 
                measure2, 
                weight, 
                photoSelected 
            } = req.body

            const pieceWithTheSameName = await Piece.findOne({name})

            if(pieceWithTheSameName && piece.name !== name.toLowerCase()){
                const error = new Error('Ya existe una pieza con ese nombre.')
                return res.status(400).json({error: error.message})
            }

            if(req.files !== null){
                const file = req.files['newPhotoFile']
                const fileArray = Array.isArray(file) ? file : [file]
                const newPhoto = fileArray[0]

                const { width, height } = await sharp(newPhoto.data).metadata()
                if(width !== height){
                    const error = new Error('La imagen dede ser cuadrada.')
                    return res.status(400).json({error: error.message})
                }

                const imageWebp = await sharp(newPhoto.data)
                    .toFormat("webp", {quality: 80})
                    .toBuffer()

                const storageRef = ref(storage, photoSelected);

                await uploadBytes(storageRef, imageWebp, { contentType: "image/webp" });
            }

            piece.name = name
            piece.availability = availability
            piece.caratage = caratage
            piece.category = category
            piece.description = description
            piece.measure = measure
            if(measure2){
                piece.measure2 = measure2
            }
            piece.weight = weight
            
            await piece.save()

            res.send("Pieza Actuazliada Correctamente")          
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static deletePiece = async (req: Request<{pieceId: string}, {}, {}>, res: Response) => {
        try {
            const { pieceId } = req.params
            const piece = await Piece.findById(pieceId)

            if(!piece){
                const error = new Error('Pieza no encontrada')
                return res.status(404).json({error: error.message})
            }

            piece.photos.forEach(async photo => {
                const photoRef = ref(storage, photo);
                await deleteObject(photoRef)
            })

            await piece.deleteOne()
            res.send("Pieza Eliminada Correctamente")
        } catch (error) {
            res.status(500).send(error);
        }
    }   

    static changeAvailability = async (req: Request<{pieceId: string}, {}, {}>, res: Response) => {
        try {
            const { pieceId } = req.params
            const piece = await Piece.findById(pieceId)

            if(!piece){
                const error = new Error('Pieza no encontrada')
                return res.status(404).json({error: error.message})
            }

            piece.availability = piece.availability ? false : true

            await piece.save()

            res.send("Disponibilidad Actualizada Correctamente")
        } catch (error) {
            res.status(500).send(error);
        }
    }  
}

