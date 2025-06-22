//this middle ware check the accessToken is valid
import jwt, { decode } from 'jsonwebtoken'

export const verifyAccessToken=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    console.log(authHeader)
    //token is not valid res error
    if(!authHeader?.startsWith('Bearer ')){
         return res.sendStatus(401);
    }

    //take token and verify
    const token=authHeader.split('')[1];
    jwt.verify(token,process.env.JWT_ACCESS_SECRET,(err,decoded)=>{
        if(err) return res.sendStatus(403)
        req.userId=decoded.id;
        next()
    })
}