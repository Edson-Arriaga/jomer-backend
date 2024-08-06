import { CorsOptions } from 'cors'
 
export const corsConfig : CorsOptions = {
    origin: function(origin, callback){
        const whiteList = [process.env.FRONTEND_URL]
        console.log("ORIGEN: " + origin)
        if(process.argv[2] === '--api'){
            whiteList.push(undefined)
        }

        if(whiteList.includes(origin || process.env.BACKEND_URL)){
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}