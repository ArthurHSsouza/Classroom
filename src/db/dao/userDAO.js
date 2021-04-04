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
        
        }catch(Exception){

            console.log(Exception);
            throw(Exception);

        }
    }

    getUser = async (email, id) => {

            try{
                if(email){
                   
                    let query = `SELECT * FROM users WHERE email = "${email}" AND validated = 1`;
                    let [rows] = await this.conn.execute(query);
                    return rows;

                }else if(id){
                   
                    let query = `SELECT * FROM users WHERE id = "${id}" AND validated = 1`;
                    let [rows] = await this.conn.execute(query);
                    return rows;
                }

            }catch(Exception){
                
                console.log(Exception);
                throw(Exception);
            }
    }

    getUserByIdAndAuth = async (userId, code) => {

            try{

                let query = `UPDATE users SET validated = 1 WHERE id = "${userId}" 
                AND validateAccount = "${code}" 
                AND validated = 0;`;

                let [data] = await this.conn.execute(query);
                return data.affectedRows;

            }catch(Exception){
                console.log(Exception);
                throw Exception;
            }

    }

    /*update = async(user) => {
    }*/

}