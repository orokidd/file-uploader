const prisma = require("../config/prisma.js");

const uploadFile = async (req, res) => {
    await prisma.file.create({
        data: {
            name: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            url: req.file.path,
            mimetype: req.file.mimetype,
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
            originalName: req.file.originalname,
            size: req.file.size,
            url: req.file.path,
            mimetype: req.file.mimetype,
            userId: req.user.id,
            folderId: parseInt(folderId)
        }
    })
    res.redirect(`/folders/${folderId}`)
}

const getFileDetails = async (req, res) => {
    const fileId = req.params.fileId
    const file = await prisma.file.findUnique({
        where: { id: parseInt(fileId)}
    })
    res.render("./file/file", { user: req.user, file })
}

const downloadFile = async (req, res) => {
    const fileId = req.params.fileId
    const file = await prisma.file.findUnique({
        where: { id: parseInt(fileId) }
    })
    res.download(`uploads/${file.name}`)
}

const deleteFile = async (req, res) => {
    const fileId = req.params.fileId;
    await prisma.file.delete({
        where: { id: parseInt(fileId) }
    })
    res.redirect("/dashboard")
}

module.exports = {
    uploadFile,
    uploadFileToFolder,
    getFileDetails,
    downloadFile,
    deleteFile
}