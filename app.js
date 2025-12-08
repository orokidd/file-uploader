require("dotenv").config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./config/prisma.js');

const indexRouter = require('./routes/index.routes.js');
const authRouter = require('./routes/auth.routes.js');
const folderRouter = require('./routes/folders.routes.js');
const fileRouter = require('./routes/files.routes.js');

const initializePassport = require('./config/passport.js');
const errorHandler = require('./middleware/errorHandler.js');

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static('uploads'))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore( prisma,
      {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true,
      }
    ),
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
    })
);

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', folderRouter);
app.use('/', fileRouter);

app.use(errorHandler.notFound)
app.use(errorHandler.serverError)

app.listen(3000, (error) => {
  if (error) {
    throw error
  }
  console.log('Server is running on port 3000');
});