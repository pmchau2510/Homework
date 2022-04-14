const express = require('express');
const { catchError, notFound } = require("./middlewares/error");
const connectDB = require('./config/connect');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const morgan = require('morgan');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const documentRoutes = require('./routes/document');
// const helmet = require('helmet');
const swaggerUI = require('swagger-ui-express');
const path = require('path');

const app = express();
dotenv.config({ path: './config/.env' });

const swaggerDoc = require('./swagger.json');
app.use(cors());
// app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


require('./config/passport')(passport);

app.use(morgan('dev'));
//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));

//Passport middleware
app.use(passport.session());


//Routes
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use('/api/auth', authRoutes);
app.use('/api/admin/documents', documentRoutes);
app.use('/api/user', userRoutes);

app.use(notFound);
app.use(catchError);
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