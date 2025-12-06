import { prisma } from '../app.js';

const uploadFile = async (req, res) => {
    await prisma.file.create({
        data: {
            name: req.file.filename,
            size: req.file.size,
            url: req.file.path,
            userId: req.user.id
        }
    })
    res.redirect("/dashboard");
}

const uploadFileToFolder = async (req, res) => {
    const folderId = req.params.folderId
    await prisma.file.create({
        data: {
            name: req.file.filename,
            size: req.file.size,
            url: req.file.path,
            userId: req.user.id,
            folderId: parseInt(folderId)
        }
    })
    res.redirect(`/folder/${folderId}`)
}

const getFileDetails = async (req, res) => {
    const fileId = req.params.fileId
    const file = await prisma.file.findUnique({
        where: { id: parseInt(fileId)}
    })
    res.render("fileDetails", { user: req.user, file })
}

const downloadFile = async (req, res) => {
    const fileId = req.params.fileId
    const file = await prisma.file.findUnique({
        where: { id: parseInt(fileId) }
    })
    res.download(file.url, file.name)
}

export default {
    uploadFile,
    uploadFileToFolder,
    getFileDetails,
    downloadFile
}