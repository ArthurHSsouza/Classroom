import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

export default class DBFactory{

    connection;
    
    constructor(){

        dotenv.config();
        this.connection = mysql.createPool({ 
            
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
    }
    
    getConnection(){
        return this.connection;
    }
}

