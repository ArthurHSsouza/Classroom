import {promisify} from 'util';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import UserDAO from '../db/dao/userDAO.js';
import Exception from '../exceptions/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import emailSender from '../services/emailSender.js';

export default class UserModel {

    #userDAO; #hash; #compare; #salt;

    constructor(){
       
        this.#userDAO = new UserDAO();
        this.#hash = promisify(bcrypt.hash);
        this.#compare = promisify(bcrypt.compare);
        this.#salt = promisify(bcrypt.genSalt);
        dotenv.config();

    }

    //Validation

    #validateUser = (user, full) => {
        
        if(user.email == null || typeof user.email == undefined/*|| !user.email.match('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')*/)
            throw Exception.userValidationException("E-mail inválido");
        
        if(user.password == null || user.password.length < 6)
            throw Exception.userValidationException("Senha não atende os requisitos mínimos");
        
        if(full){
            
            if(user.name == null || user.name.length < 5)
                throw Exception.userValidationException("Nome inválido");
            
            if(user.rPassword == null || user.rPassword.length < 6 || user.password !== user.rPassword)
                throw Exception.userValidationException("Repetição de senha incompatível");
        }
    }

    //models

    signin = async (user) => {

        try{

            this.#validateUser(user, true);
            let userList = await this.#userDAO.getUserByEmail(user.email);
            if(userList.length > 0)
                throw Exception.userValidationException("E-mail indisponível");
            
            let salt = await this.#salt(10);
            user.password = await this.#hash(user.password, salt);
            let validationHash = crypto.randomBytes(20).toString('hex');
            let id = await this.#userDAO.createUser(user, validationHash);
            
            await emailSender(user.email, "Welcome!",
            `<h1>Welcome to Classroom!</h1>
                </br>
                </br>
                <p>We're glad to welcome you, ${user.name}, to our platform.
                   To access your profile, you just need to authenticate your account 
                   by clicking on the link below:
                </p>
                <a href="localhost:8080/validateAccount/${id}/${validationHash}">
                <button><h4>Authenticate account</h4></button></a>
            `);

        }catch(Exception){
            console.log(Exception);
            throw(Exception);
        }
    }

   login = async (user) => {

        try{
           
            this.#validateUser(user, null);
            let [userFound] = await this.#userDAO.getUserByEmail(user.email);
            if(!userFound)
                throw Exception.userValidationException("E-mail incorreto");
  
            if(!this.#compare( userFound.password, user.password))
                throw Exception.userValidationException("Senha incorreta");

            let token = jwt.sign({
                name: userFound.username,
                email: userFound.email
            }, process.env.SECRET,
                {
                    expiresIn: "7d"
                }
            );

            return token;
            
        }catch(Exception){
            console.log(Exception);
            throw Exception;
        }
    }

    validateAccount = async (userId, code) => {

        let user = await this.#userDAO.getUserByIdAndAuth(userId, code);
        if(user){
            return;
        }else{
            throw Exception.userNotFoundException("Usuário não encontrado");
        }
    }
}