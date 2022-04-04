const express = require('express');
const connectDB = require('./config/connect');
const dotenv = require('dotenv');
const passport = require('passport');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const documentRoutes = require('./routes/document');
// const path = require('path');
const app = express();
//Load config
dotenv.config({ path: './config/.env' });

//Body parser
// app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');

//Passport config
require('./config/passport')(passport);

//Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, }),
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/api/admin/documents', documentRoutes);
app.use('/api/documentUser', userRoutes);

const PORT = process.env.PORT || 3000;
const start = async() => {
    try {
        await connectDB();
        app.listen(PORT, console.log(`Server is listening in PORT ${PORT}...`));
    } catch (error) {
        console.log(error);
    }
}
start();