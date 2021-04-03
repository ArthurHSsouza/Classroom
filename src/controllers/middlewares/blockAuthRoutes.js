export default (req, res, next) => {

    if(req.headers['x-access-token']){
        res.status(200).json({message: "Usuário já autenticado"});
    }else{
        next();
    }
}