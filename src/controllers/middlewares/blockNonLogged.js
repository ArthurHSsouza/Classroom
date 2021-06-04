import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    
    let token = req.headers['authorization']
    
    if(!token){
        res.status(401).json({message: "Token inválido"});
    }

    try{
        let {userId} = jwt.verify(token.split(' ')[1], process.env.SECRET)
        if(userId){

            req.params.userId = userId;
            next();
            return;

        }
    }catch(Exception){

        res.status(401).json({message: "Token inválido"});

    }
}