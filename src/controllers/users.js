import UserModel from '../models/UserModel.js';


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
            res.json({message: "Usuário salvo com sucesso"});

        }catch(Exception){
   
            res.statusCode = Exception.statusCode || 500;
            res.json({message: Exception.treated ? Exception.message : "Erro interno do servidor"});
        }
        
    }

    login = async (req,res) => {

        try{
            
            let {email, password} = req.body;
            let user = {email, password};
            let token = await this.#model.login(user);
            res.status(200).json({message: "Usuário autenticado com sucesso", token});

        }catch(Exception){

            res.statusCode = Exception.statusCode || 500;
            res.json({message: Exception.treated ? Exception.message : "Erro interno do servidor"});

        }
    }

    validateAccount = async (req, res) => {
        
            try{

                let {userId, code} = req.params;
                await this.#model.validateAccount(userId, code);
                res.status(200).send("Sua conta foi validada!");
                
            }catch(Exception){

            }

    }

 }