
//Express
import express from 'express';
const app = express();

//Routes
import users from './src/routes/usersRoutes.js';

//Middleware for catching request data
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Setting routes
app.use('/users', users);

//Launching server
const PORT = process.env.PORT || 8080;
app.listen(PORT,(err)=>{
    err ? console.log("Error in the port "+PORT) : console.log("server running on port "+PORT);
});


