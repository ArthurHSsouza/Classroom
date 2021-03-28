export default class UserException
{
      static userValidationException(message){
                
            return{
                    message: message,
                    treated:true,
                    statusCode: 400
                }
        }
}