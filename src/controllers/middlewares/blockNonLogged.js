import jwt from 'jsonwebtoken';


export default (req, res, next) => {
    
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({message: "Token inválido"});
    }
    let decoded = jwt.verify(token, process.env.SECRET);
    if(decoded){
        next();
        return;
    }
    res.status(401).json({message: "Token inválido"});
    
}