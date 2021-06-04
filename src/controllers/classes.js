import ClassModel from '../models/ClassModel.js';

export default class ClassController{

    #model;

    constructor(){

        this.#model = new ClassModel();
    }

    create = (req,res) => {

        let {title, description} = req.body;
        let teacher = req.params.id;
        
        /*try{
            this.#model.
        }*/
    }
}