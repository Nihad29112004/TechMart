const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req , res , next)=> {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({message:"Token yoxdur,giris icazeside yoxdur"});
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decoded;
        next();

    }catch(err){
        return res.status(403).json({message: "Token etibarsizdir"});
    }
};
module.exports = authMiddleware;

