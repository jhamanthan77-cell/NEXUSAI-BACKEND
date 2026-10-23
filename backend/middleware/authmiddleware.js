import jwt from "jsonwebtoken";
const authMiddleware= (req,res,next)=>{
const authHeader= req.headers.authorization
//check that header is in correct format;
if(!authHeader||!authHeader.startsWith("Bearer ")){
    return res.status(401).json({
        success:false,
        message:"Authorization token missing or invalid"
    });
}
//token extraction from header;
const token = authHeader.split(" ")[1];
try {
    const decoded= jwt.verify(token,process.env.JWT_SECRET);
    req.user=decoded;
    next();
} catch (error) {
    return res.status(401).json({
     success:false,
     message:"invalid token or token is missing "
    
 })
}
}
export default authMiddleware;