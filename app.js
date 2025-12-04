import express from 'express';
import path from 'path'
import session from 'express-session'
import passport from 'passport'

import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

const app = express()
export const prisma = new PrismaClient()

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

app.use(passport.initialize());
app.use(passport.session());