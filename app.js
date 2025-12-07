require("dotenv").config();

import express from 'express';
import path from 'path'
import session from 'express-session'
import passport from 'passport'
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

import indexRouter from './routes/index.routes.js';

import initializePassport from './config/passport.js';
import errorHandler from './middleware/errorHandler.js'

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

app.use(errorHandler.notFound)
app.use(errorHandler.serverError)

app.listen(3000, (error) => {
  if (error) {
    throw error
  }
  console.log('Server is running on port 3000');
});