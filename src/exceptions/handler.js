export default function handler(Exception,res){
    
    console.log(Exception.message);
    res.statusCode = Exception.statusCode || 500;
    res.json({message: Exception.treated ? Exception.message : "Erro interno do servidor"});

}