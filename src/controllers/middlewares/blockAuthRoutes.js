import jwt from 'jsonwebtoken';

export default (req, res, next) => {

    if(req.headers['authorization']){

        let token = req.headers['authorization'].split(' ')[1];
        try{
                 let userId = jwt.decode(token, process.env.SECRET).userId;
                 if(userId){
                     
                    res.status(200).json({message: "Usuário já autenticado"});
                    return;
                    
                }
        }catch(Exception){

            res.status(401).json({message: "Token inválido"});
            return;

        }
    }

    next();

}