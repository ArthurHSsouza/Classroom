export default (req, res, next) => {
    if(req.headers['authorization'].split(' ')[1]){
        res.status(200).json({message: "Usuário já autenticado"});
    }else{
        next();
    }
}