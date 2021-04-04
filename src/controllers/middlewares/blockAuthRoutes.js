export default (req, res, next) => {

    if(req.headers['authorization']){
        res.status(200).json({message: "Usuário já autenticado"});
    }else{
        next();
    }
}