export default {
      
      validationException: (message)=>{
                
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
      },

     ErrorSendingEmailException: (email)=>{
      
            return{ 
                    message: `Erro ao tentar enviar e-mail para o endereço ${email}`,
                    treated: true,
                    statusCode: 401 
                }
      }
}