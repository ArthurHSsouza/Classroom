import express from 'express';
import Controller from "../controllers/users.js";
import blockAuthRoutes from '../controllers/middlewares/blockAuthRoutes.js';


const router = express.Router();
let controller = new Controller();

router.post('/signin', blockAuthRoutes, controller.signin);
router.post('/login', blockAuthRoutes, controller.login);

export default router;


