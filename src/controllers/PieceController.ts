import { Request, Response } from "express"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import sharp from "sharp"
import { PieceBodyType } from "../types"
import app from "../config/firebaseConfig";
import Piece from "../models/Piece";

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

            const storage = getStorage(app, "gs://jomer-ba42e.appspot.com");

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
            return res.status(500).json({error: error})  
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
            res.send(error)
        }
    }
}

