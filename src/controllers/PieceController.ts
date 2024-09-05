import { Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import sharp from "sharp"
import { FilterBodyType, FilterObjectType, PhotoBodyType, PieceBodyType, PieceUpdateBodyType } from "../types"
import {storage} from "../config/firebaseConfig";
import Piece from "../models/Piece";

export class PieceController {
    static addPiece = async (req: Request<{}, {}, PieceBodyType>, res: Response) => {
        try {
            const matchedPiece = await Piece.findOne({name: req.body.name.toLocaleLowerCase()})

            if(matchedPiece){
                const error = new Error('Ya existe una pieza con ese nombre.')
                return res.status(409).json({error: error.message})
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
                    return res.status(422).json({error: error.message})
                }
            }

            const piece = new Piece({
                ...req.body,
                photos: []
            });
            
            let photos : string[] = []

            await Promise.all(fileArray.map( async (file, i) => {
                const imageWebp = await sharp(file.data)
                .resize(850, 850)
                .toFormat("webp", {quality: 85})
                .toBuffer()
                
                const webpFileName = `${piece._id}_${i}.webp`

                const storageRef = ref(storage, `${piece._id}/${webpFileName}`);
                await uploadBytes(storageRef, imageWebp, { 
                    contentType: "image/webp"   
                });

                const downloadURL = await getDownloadURL(storageRef);
                
                photos.push(downloadURL)
            }))
            
            piece.photos = photos
            piece.save()
            res.send('Pieza Añadida Correctamente');
        } catch (error) {
            return res.status(500).json({error: error.message})  
        }
    }

    static getPieces = async (req: Request<{}, {}, {}, FilterBodyType>, res: Response) => {
        const limit = 12;
        const page = parseInt(req.query.page) || 1; 
        const skip = (page - 1) * limit; 


        const filter = {} as FilterObjectType

        if(req.query.category){
            if(req.query.category === 'marriage'){
                filter.category = { $in: ['engagementRing', 'weddingRing']}
            }else {
                filter.category = req.query.category
            }
        }

        if(req.query.caratage){
            filter.caratage = req.query.caratage
        }

        if(req.query.availability){
            filter.availability = req.query.availability
        }
        
        try {
            const pieces = await Piece.find(filter).skip(skip).limit(limit).sort({createdAt: -1});
            const totalPieces = await Piece.countDocuments();
            const hasMore = skip + limit < totalPieces;
            const nextPage = hasMore ? page + 1 : null;

            res.send({ pieces, nextPage });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };

    static getPieceById = async (req: Request, res: Response) => {
        try {
            res.send(req.piece)
        } catch (error) {
            return res.status(500).json({error: error.message})  
        }
    }

    static updatePiece = async (req: Request<{pieceId: string}, {}, PieceUpdateBodyType>, res: Response) => {
        try {
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

            if(pieceWithTheSameName && req.piece.name !== name.toLowerCase()){
                const error = new Error('Ya existe una pieza con ese nombre.')
                return res.status(409).json({error: error.message})
            }

            if(req.files !== null){
                const file = req.files['newPhotoFile']
                const fileArray = Array.isArray(file) ? file : [file]
                const newPhoto = fileArray[0]

                const { width, height } = await sharp(newPhoto.data).metadata()
                if(width !== height){
                    const error = new Error('La imagen dede ser cuadrada.')
                    return res.status(422).json({error: error.message})
                }

                const imageWebp = await sharp(newPhoto.data)
                    .resize(850, 850)
                    .toFormat("webp", {quality: 85})
                    .toBuffer()

                const storageRef = ref(storage, photoSelected);

                await uploadBytes(storageRef, imageWebp, { contentType: "image/webp" });
            }

            req.piece.name = name
            req.piece.availability = availability
            req.piece.caratage = caratage
            req.piece.category = category
            req.piece.description = description
            req.piece.measure = measure
            if(measure2){
                req.piece.measure2 = measure2
            }
            req.piece.weight = weight
            
            await req.piece.save()
            
            res.send("Pieza Actuazliada Correctamente")          
        } catch (error) {
            return res.status(500).json({error: error.message})  
        }
    }

    static deletePiece = async (req: Request<{pieceId: string}, {}, {}>, res: Response) => {
        try {
                req.piece.photos.forEach(async photo => {
                const photoRef = ref(storage, photo);
                await deleteObject(photoRef)
            })

            await req.piece.deleteOne()
            res.send("Pieza Eliminada Correctamente")
        } catch (error) {
            return res.status(500).json({error: error.message})  
        }
    }   

    static changeAvailability = async (req: Request<{pieceId: string}, {}, {}>, res: Response) => {
        try {
            req.piece.availability = !req.piece.availability
            await req.piece.save()
            res.send("Disponibilidad Actualizada Correctamente")
    
        } catch (error) {
            return res.status(500).json({error: error.message})  
        }
    }  

    static deleteImage = async (req: Request<{pieceId: string}, {}, PhotoBodyType>, res: Response) => {
        try {
            req.piece.photos = req.piece.photos.filter(photo => photo !== req.body.photo)
            const photoRef = ref(storage, req.body.photo);
            await deleteObject(photoRef)

            req.piece.save()
            res.send("Imagen eliminada correctamente")

        } catch (error) {
            return res.status(500).json({error: error.message})  
        }
    }

    static addImage = async (req: Request<{pieceId: string}, {}, {}>, res: Response) => {
        try {
            const files = req.files.photo
            const filesArray = Array.isArray(files) ? files : [files]
            const file = filesArray[0]
            
            const { width, height } = await sharp(file.data).metadata();
            if(width !== height){
                const error = new Error('La imagen deden ser cuadrada.')
                return res.status(422).json({error: error.message})
            }

            const imageWebp = await sharp(file.data)
                .resize(850, 850)
                .toFormat("webp", {quality: 85})
                .toBuffer()
        
            const uniqueId = uuidv4()
            const webpFileName = `${req.piece._id}_${uniqueId}.webp`

            const storageRef = ref(storage, `${req.piece._id}/${webpFileName}`);
            await uploadBytes(storageRef, imageWebp, { contentType: "image/webp" });
            const downloadURL = await getDownloadURL(storageRef);
                
            req.piece.photos.push(downloadURL)
            req.piece.save()

            res.send("Imagen Agregada Correctamente")
    
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }
}

