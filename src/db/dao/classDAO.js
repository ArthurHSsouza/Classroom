import DBFactory from '../dbFactory.js';

export default class classDAO{


    constructor(){

        this.conn = new DBFactory().getConnection();
        
    }

    createClass =   async (Class, photo) => {

        let query = `INSERT INTO classes`;
        let {title, description, teacher} = Class;
        
        if(photo){
            query += `(title, description, teacher, class_photo)
            VALUES("${title}", "${description}", ${teacher}, "${photo}");`;
        }else{
            query += `(title, description, teacher)
            VALUES(${title}, ${description}, ${teacher});`;
        }
        
        let [data] = await this.conn.execute(query);
        return data.insertId;
    }

}