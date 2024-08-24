import { CorsOptions } from 'cors'

const whiteList = [process.env.FRONTEND_URL, 'http://localhost:5173']

export const corsConfig : CorsOptions = {
    origin: function(origin, callback){
        console.log(origin)
        if(process.argv[2] === '--api'){
            whiteList.push(undefined)
        }
        if(whiteList.includes(origin)){
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    },
    methods: 'GET, HEAD, PUT, POST, DELETE, PATCH'
}