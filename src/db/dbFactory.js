import mysql from 'mysql2/promise';

export default class DBFactory{

    connection;
    
    constructor(){

        this.connection = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '18901347a',
            database: 'classroom'

        });
    }
    
    getConnection(){
        return this.connection;
    }
}

