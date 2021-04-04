export default class UserException
{
      static userValidationException(message){
                
            return{
                    message: message,
                    treated:true,
                    statusCode: 400
                }
        }

      static userNotFoundException(){
      
            return{ 
                    message: "Usuário não encontrado",
                    treated:true,
                    statusCode: 404 
                }
      }
}