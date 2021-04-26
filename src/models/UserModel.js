import {promisify} from 'util';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import UserDAO from '../db/dao/userDAO.js';
import exceptionHandler from '../exceptions/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import emailSender from '../services/emailSender.js';
import { Console } from 'console';

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

    #validatePassword = (password, rPassword) => {
        if(rPassword == null || rPassword.length < 6 || password !== rPassword)
            throw exceptionHandler.userValidationException("Repetição de senha incompatível");
    }

    #validateUser = (user, full) => {
        
        if(user.email == null || typeof user.email == undefined/*|| !user.email.match('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')*/)
            throw exceptionHandler.userValidationException("E-mail inválido");
        
        if(user.password == null || user.password.length < 6)
            throw exceptionHandler.userValidationException("Senha não atende os requisitos mínimos");
       
        if(full){

            if(user.name == null || user.name.length < 5){
                throw exceptionHandler.userValidationException("Nome inválido");
            }

            this.#validatePassword(user.password, user.rPassword);
        }   
    }

    //models

    signin = async (user) => {

        this.#validateUser(user, true);
        let userList = await this.#userDAO.getUser(user.email,null);
        /*if(userList.length > 0)
            throw Exception.userValidationException("E-mail indisponível");*/
            
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
        by accessing the link below:
        </p>
        <!--<a href="localhost:8080/validateAccount/${id}/${validationHash}">
        <button><h4>Authenticate account</h4></button>-->
        localhost:8080/users/validateAccount/${id}/${validationHash}
        </a>
        `);
    }
    

   login = async (user) => {
  
        this.#validateUser(user, null);
        let [userFound] = await this.#userDAO.getUser(user.email,null);
        if(!userFound)
            throw exceptionHandler.userValidationException("E-mail incorreto");
  
        if(!this.#compare( userFound.password, user.password))
            throw exceptionHandler.userValidationException("Senha incorreta");

        let token = jwt.sign({
            name: userFound.username,
            email: userFound.email
        }, process.env.SECRET,
            {
                 expiresIn: "7d"
            }
        );
        return token;   
    }

    validateAccount = async (userId, code) => {

        let user = await this.#userDAO.getUserByIdAndAuth(userId, code);
        if(user){
            
            let [userUpdated] = await this.#userDAO.getUser(null, userId);
            
            let token = jwt.sign({
                name: userUpdated.username,
                email: userUpdated.email
            }, process.env.SECRET,
                {
                    expiresIn: "7d"
                }
            );

            return token;

        }else{
            throw exceptionHandler.userNotFoundException();
        }
    }

    setRecoverToken = async (email) => {

        let foundedUser = await this.#userDAO.getUser(email,null);
        if(foundedUser){
            
            let recoverToken = crypto.randomBytes(20).toString('hex');
            let expires = Date.now() + 1000 * 60 * 60;
            await this.#userDAO.setResetPasswordToken(email, recoverToken, expires);
            emailSender(email, "Change password",
            `<h1>Change password</h1>
            </br>
            <p>
             Use the following code to change your passoword: <b>${recoverToken}</b>
            </p>
        `);
            
        }else{
          throw exceptionHandler.userNotFoundException();
        }
    }

    validateRecoverToken = async(token, email) => {

        let userId =  await this.#userDAO.getRecoverToken(token, email); 
    
        if(userId){
            
            let authorizeToken = jwt.sign({
                email,
                userId
            },process.env.RECOVERY_TOKEN_SECRET,{
                expiresIn: "1h"
            });
            return authorizeToken;
        }else
            throw exceptionHandler.notAuthorized("Token não encontrado para usuário");
    }


    resetPassword = async (password, rePassword, token) => {
        
        let tokenData;

        try{

            tokenData = jwt.verify(token.split(' ')[1], 
            process.env.RECOVERY_TOKEN_SECRET);
        
        }catch(Exception){

            throw exceptionHandler.notAuthorized("Token inválido"); 

        } 

        if(!tokenData.userId){

            throw exceptionHandler.notAuthorized("Token inválido"); 
        }

            this.#validatePassword(password, rePassword);
            this.#userDAO.updatePassword(password, tokenData.userId);
    }
}