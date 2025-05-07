const express = require('express');
const app = express();
const userRouter = require('./route/user.route.js');
const authRouter = require('./route/auth.route.js');
const messageRouter = require('./route/message.route.js');
const roleRouter = require('./route/role.route.js');
const {connect} = require('./framework/connection.js');
const sync = require('./framework/sync.js');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    stndardHeaders: 'draft-8',
    legacyHeaders: false,
    message: "Trop de requêtes, veuillez réessayer plus tard"
});

const database = async () => {
    await connect();
    await sync();
}

database();

app.use(express.json());
app.use(limiter); 

app.use('/user',userRouter);
app.use('/auth',authRouter);
app.use('/message',messageRouter);
app.use('/role',roleRouter);


module.exports = app;