export default {
      
      userValidationException: (message)=>{
                
            return{
                    message: message,
                    treated:true,
                    statusCode: 400
                }
        },

      userNotFoundException: ()=>{
      
            return{ 
                    message: "Usuário não encontrado",
                    treated:true,
                    statusCode: 404 
                }
      },

      notAuthorized: (message)=>{
      
            return{ 
                    message,
                    treated: true,
                    statusCode: 401 
                }
      }
}