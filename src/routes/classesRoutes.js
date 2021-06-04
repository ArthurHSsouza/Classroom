import express from 'express';
import Controller from '../controllers/classes.js';
import blockNonLogged from '../controllers/middlewares/blockNonLogged.js';


const router = express.Router();
let controller = new Controller();


router.post('/create', blockNonLogged, controller.create);


export default router;