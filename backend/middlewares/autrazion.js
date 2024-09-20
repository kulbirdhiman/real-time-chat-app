import jwt from 'jsonwebtoken';
import User from '../model/User.js'
const authTion = async(req,res,next)=>{
    let token = req.cokkie.jwt;
    if(token){
       const decodded = jwt.verify(token,process.env.Secret) ;
       req.user = await User.findById(decodded._id)
       next
    }
    res.send("not authrize not token")
}

export {authTion}