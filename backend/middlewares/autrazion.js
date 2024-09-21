import jwt from 'jsonwebtoken';
import User from '../model/User.js'
const authTion = async(req,res,next)=>{
    let token = req.cookies.jwt;
    try {
        if(token){
            const decodded = await jwt.verify(token,"karan") ;
            // console.log(decodded)
            req.user = await User.findById(decodded.userId)
            next()
         }
    } catch (error) {
        
        res.send("not authrize not token")
    }
}

export {authTion}