import mongoose, { Schema, Document } from "mongoose"

export interface IPiece extends Document {
    name: string,
    price: number,
    category: string,
    weight: number,
    caratage: string,
    description: string,
    measure: number,
    measure2: number,
    photos: string[]
}

const pieceSchema : Schema = new Schema<IPiece>({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    weight: {
        type: Number,
        required: true
    },
    caratage: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    measure: {
        type: Number,
        required: true
    },
    measure2: {
        type: Number,
        trim: true
    },
    photos: {
        type: [String],
        required: true,
        validate: [arrayLimit]
    }
})

function arrayLimit(val : string[]) {
    return val.length >= 1 && val.length <= 5
}

const Piece = mongoose.model<IPiece>('Piece', pieceSchema)
export default Piece