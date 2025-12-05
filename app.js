require("dotenv").config();

import express from 'express';
import path from 'path'
import session from 'express-session'
import passport from 'passport'

import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

// import indexRouter from './routes/index.routes.js';

import initializePassport from './config/passport.js';
import checkAuthentication from './middleware/checkAuthentication.js';

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

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// app.use('/', indexRouter)

// app.get("/dashboard", checkAuthentication, async (req, res) => {
//     const user = req.user;
//     const files = await prisma.file.findMany({
//         where: { userId: user.id }
//     });
//     const folders = await prisma.folder.findMany({
//         where: { userId : user.id }
//     })
//     res.render("dashboard", { user, files, folders }); 
// });

// app.get("/upload", checkAuthentication, (req, res) => {
//   res.render("upload")
// } )

app.post("/uploadFile", checkAuthentication, upload.single('file'), async (req, res) => {
  await prisma.file.create({
    data: {
      name: req.file.filename,
      size: req.file.size,
      url: req.file.path,
      userId: req.user.id
    }
  })
  res.redirect("/dashboard")
})

app.get("/folder/:id", checkAuthentication, async (req, res) => {
  const folderId = req.params.id
  const user = req.user;

  const folder = await prisma.folder.findUnique({
    where: { id: parseInt(folderId) , userId: user.id}
  })
  const files = await prisma.file.findMany({
      where: { folderId: parseInt(folderId), userId: user.id }
  });
  res.render("folder", { user, folder, files });
})

app.post("/folder", checkAuthentication, async (req, res) => {
  await prisma.folder.create({
    data: {
      name: req.body.foldername,
      userId: req.user.id
    }
  })
  res.redirect("/dashboard")
})

app.post("/folder/:id/uploadFile", checkAuthentication, upload.single('file'), async (req, res) => {
  const folderId = req.params.id
  
  await prisma.file.create({
    data: {
      name: req.file.filename,
      size: req.file.size,
      url: req.file.path,
      userId: req.user.id,
      folderId: parseInt(folderId)
    }
  })
})

app.get("/file/:fileId", checkAuthentication, async (req, res) =>{
  const fileId = req.params.fileId
  const file = await prisma.file.findUnique({
    where: { id: parseInt(fileId) }
  })

  res.render("fileDetails", { user: req.user, file })
})

app.get("/file/:fileId/download", checkAuthentication, async (req, res) => {
  const fileId = req.params.fileId
  const file = await prisma.file.findUnique({
    where: { id: parseInt(fileId) }
  })
  res.download(file.url, file.name)
})