import DBFactory from '../dbFactory.js';

export default class UserDAO{

    constructor(){
        this.conn = new DBFactory().getConnection();
    }

    createUser = async (user) => {

        let {name, email, password} = user;
        
        try{

            let query = `INSERT INTO users(username, email, password)
            VALUES("${name}","${email}","${password}")`;
            (await this.conn).query(query);
        
        }catch(exception){

            console.log(exception);
            throw(exception);

        }
    }

    getUserByEmail = async (email) => {

            try{
                
                let query = `SELECT * FROM users WHERE email = "${email}"`;
                let [rows] = await this.conn.execute(query);
                return rows;

            }catch(Exception){
                
                console.log(Exception);
                throw(Exception);
            }
    }

    

    /*update = async(user) => {
    }*/

}