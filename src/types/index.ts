export type PieceBodyType = {
    name: string
    description: string
    availability: boolean
    category: string
    measure: number
    measure2: number
    weight: number
    caratage: string
}

export type PieceUpdateBodyType = PieceBodyType & {
    photoSelected: string
}

export type PhotoBodyType = {photo: string}

export type FilterBodyType = {
    page: string,
    category?: string | { $in: string[] },
    caratage?: string,
    availability?: string
}

export type FilterObjectType = Omit<FilterBodyType, 'page'>

