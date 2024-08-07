export type PieceBodyType = {
    name: string
    description: string
    price: number
    category: string
    measure: number
    measure2: number
    weight: number
    caratage: string
}

export type PieceUpdateBodyType = PieceBodyType & {
    photoSelected: string,
   
}