const express = require('express');
const app = express();
const path = require('path');
const connectDB = require('./config/connect');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const morgan = require('morgan');

//Load config
dotenv.config({ path: './config/config.env' });

//Passport config
require('./config/passport')(passport);

//Logging
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,

}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes

const PORT = process.env.PORT || 3000;
const start = async() => {
    try {
        await connectDB();
        app.listen(PORT, console.log(`Server is listening in PORT ${port}...`));
    } catch (error) {
        console.log(error);
    }
}
start();