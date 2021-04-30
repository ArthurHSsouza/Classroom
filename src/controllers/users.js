import UserModel from '../models/UserModel.js';
import handler from '../exceptions/handler.js';

 export default class UserController{

    #model;

    constructor(){

        this.#model = new UserModel(); 
    }

    signin = async (req,res) => {
       
        try{

            let {email, password, rPassword, name} = req.body;
            let user = {email, password, rPassword, name};
            await this.#model.signin(user);
            res.statusCode = 200;
            res.json({message: "Enviamos um e-mail de confirmação para o endereço informado, acesse o link fornecido para liberar a conta"});

        }catch(Exception){
             
            handler(Exception, res);
            
        }
        
    }

    login = async (req,res) => {

        try{
            
            let {email, password} = req.body;
            let user = {email, password};
            let token = await this.#model.login(user);
            res.status(200).json({message: "Usuário autenticado com sucesso", token});

        }catch(Exception){
            
            handler(Exception, res);
        }
    }

    validateAccount = async (req, res) => {
        
        try{
                
            let {userId, code} = req.params;
            let token = await this.#model.validateAccount(userId, code);
            res.status(200).json({message: "Sua conta foi validada!", token});

        }catch(Exception){  
            
            handler(Exception, res);
          
        }
    }

    setRecoverCod =  async (req, res) => {

          let {email} = req.params;
          try{

            await this.#model.setRecoverToken(email); 
            res.status(200).json({
                message: "E-mail enviado com sucesso, verifique sua caixa de mensagens",
                email
            });


        }catch(Exception){
           
            handler(Exception, res);
            
        }
    }

    validateRecoverToken = async(req, res) => {

        let {token, email} = req.params;
        try{

            let permissionToken = await this.#model.validateRecoverToken(token, email);
            res.status(200).json({token: permissionToken});

        }catch(Exception){
            
            handler(Exception, res);
           
        }

        }catch(Exception){
            res.statusCode = Exception.statusCode || 500;
            res.json({message: Exception.treated ? Exception.message : "Erro interno do servidor"});
        }
    }

    validateRecoverToken = async(req, res) => {

        let {token, email} = req.params;
        try{

            let permissionToken = await this.#model.validateRecoverToken(token, email);
            res.status(200).json({token: permissionToken});

        }catch(Exception){
            
            res.statusCode = Exception.statusCode || 500;
            res.json({message: Exception.treated ? Exception.message : "Erro interno do servidor"});
        }

    }

    resetPassword = async(req, res) => {
       
        try{

            let {password, rePassword} = req.body;
            let token = req.headers['authorization'];
            await this.#model.resetPassword(password, rePassword, token);
            res.status(200).json({message: "Senha alterada com sucesso"});

        }catch(Exception){

           
            handler(Exception, res);
       
        }

    }
}