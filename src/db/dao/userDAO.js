import DBFactory from '../dbFactory.js';

export default class UserDAO{

    constructor(){
        this.conn = new DBFactory().getConnection();
    }

    createUser = async (user, validationHash) => {

        let {name, email, password} = user;
        
        try{

            let query = `INSERT INTO users(username, email, password, validateAccount)
            VALUES("${name}","${email}","${password}", "${validationHash}")`;
            let [data] = await this.conn.execute(query);
            return data.insertId;
        
        }catch(exception){

            console.log(exception);
            throw(exception);

        }
    }

    getUserByEmail = async (email) => {

            try{
                
                let query = `SELECT * FROM users WHERE email = "${email} AND validated = 1"`;
                let [rows] = await this.conn.execute(query);
                return rows;

            }catch(Exception){
                
                console.log(Exception);
                throw(Exception);
            }
    }

    getUserByIdAndAuth = async (userId, code) => {

            try{

                let query = `UPDATE * FROM users SET validated = 1 WHERE id = ${userId} AND validateAccount = ${code}`;
                let [data] = await this.conn.execute(query);
                return data;

            }catch(Exception){
                throw Exception;
            }

    }

    /*update = async(user) => {
    }*/

}