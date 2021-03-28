import express from 'express';
import Controller from "../controllers/users.js";


const router = express.Router();
let controller = new Controller();

router.post('/signin', controller.signin);
router.post('/login',  controller.login);

export default router;


