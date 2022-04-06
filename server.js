const express = require('express');
const connectDB = require('./config/connect');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const documentRoutes = require('./routes/document');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const app = express();
dotenv.config({ path: './config/.env' });

const swaggerDoc = require('./swagger.json');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cors());
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
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/api/admin/documents', documentRoutes);
app.use('/api/user', userRoutes);

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