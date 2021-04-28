import DBFactory from '../dbFactory.js';

export default class UserDAO{

    constructor(){

        this.conn = new DBFactory().getConnection();
    }

    createUser = async (user, validationHash) => {

        let {name, email, password} = user;
        let query = `INSERT INTO users(username, email, password, validateAccount)
        VALUES("${name}","${email}","${password}", "${validationHash}")`;
        let [data] = await this.conn.execute(query);
        return data.insertId;
        
    }

    getUser = async (email, id) => {
  
        if(email){
                   
            let query = `SELECT * FROM users WHERE email = "${email}" AND validated = 1`;
            let [rows] = await this.conn.execute(query);
            return rows;

        }else if(id){
                   
            let query = `SELECT * FROM users WHERE id = "${id}" AND validated = 1`;
            let [rows] = await this.conn.execute(query);
            return rows;
        }
    }

    getUserByIdAndAuth = async (userId, code) => {

        let query = `UPDATE users SET validated = 1 WHERE id = "${userId}" 
        AND validateAccount = "${code}" 
        AND validated = 0;`;

        let [data] = await this.conn.execute(query);
        return data.affectedRows;
    }

    setResetPasswordToken = async(email, token, expires) => {

        let query = `UPDATE users 
        SET 
        resetPassword_token = "${token}",
        resetPassword_expires = "${expires}" 
        WHERE email = "${email}" 
        AND validated = 1;`;

        let [data] = await this.conn.execute(query);
        return data.affectedRows;
    }

    getRecoverToken = async (token, email) => {

        let query = `SELECT id FROM users WHERE resetPassword_token = "${token}"
        AND validated = 1
        AND email = "${email}"
        LIMIT 1
        `
        let [data] = await this.conn.execute(query);
        let id = data.length != 0 ? data[0].id : null;

        return id;
    }

    updatePassword = async(password, id) => {

        let query = `UPDATE users SET password = ${password} WHERE id = ${id}`;
        await this.conn.execute(query);
    }

}