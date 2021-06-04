import classDAO from '../db/dao/classDAO.js';
import userDAO from '../db/dao/userDAO.js';
import exceptionHandler from '../exceptions/Exceptions.js';


export default class ClassModel {

    #classDAO;
    #userDAO;

    constructor(){

        this.#classDAO = new classDAO();
        this.#userDAO = new userDAO();
        
    }

    #validateClass = (Class) => {

        if(Class.title == null || Class.description == null || 
            !this.#userDAO.getUser(null, Class.teacher).length == 0){
               
                exceptionHandler.validationException("Dados da classe inválidos");
        }

    }

    createClass = async (Class) => {

        this.#validateClass(Class);
        //TODO - verificar se já há classe com este titulo na base
        this.#classDAO.createClass(Class, null);
        
    }
}