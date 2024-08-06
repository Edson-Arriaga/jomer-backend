import { CorsOptions } from 'cors'

export const corsConfig : CorsOptions = {
    origin: function(origin, callback){
        const whiteList = [process.env.FRONTEND_URL]

        if(process.argv[2] === '--api'){
            whiteList.push(undefined)
        }

        if(whiteList.includes(origin) || !origin){
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    },
    methods: 'GET, HEAD, PUT, POST,DELETE',
    credentials: true,
}