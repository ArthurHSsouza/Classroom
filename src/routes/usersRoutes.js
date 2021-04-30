import express from 'express';
import Controller from "../controllers/users.js";
import blockAuthRoutes from '../controllers/middlewares/blockAuthRoutes.js';

const router = express.Router();
let controller = new Controller();

router.post('/signin', blockAuthRoutes, controller.signin);
router.post('/login', blockAuthRoutes, controller.login);
router.get('/validateAccount/:userId/:code', blockAuthRoutes, controller.validateAccount);
router.get('/sendRecoverEmail/:email', blockAuthRoutes, controller.setRecoverCod);
router.get('/validateRecoverToken/:email/:token', blockAuthRoutes, controller.validateRecoverToken);
router.post('/resetPassword', controller.resetPassword);

export default router;


