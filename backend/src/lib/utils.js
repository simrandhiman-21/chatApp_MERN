import jwt from "jsonwebtoken"
export const generateToken=(userId,res)=>{

    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    res.cookie("jwt",token,{
        maxAge:
        7*24*60*60*1000,
        httpOnly:true, //prevent XSS attacks cross-site srcipting attcks
        secure:process.env.NODE_ENV !=="development",
        samSite:"Strict" //CSRF attcks cross-site request forgery attcks
    })
    return token;
}