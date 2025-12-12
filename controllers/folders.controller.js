const prisma = require("../config/prisma.js");

const getFolder = async (req, res) => {
    const folderId = req.params.folderId;
    const user = req.user
    const folder = await prisma.folder.findUnique({
        where: { id: parseInt(folderId), userId: user.id }
    })

    const files = await prisma.file.findMany({
        where: { folderId: parseInt(folderId), userId: user.id }
    })

    res.render("./folder/folder", { user, folder, files })
}

const createFolder = async (req, res) => {
    await prisma.folder.create({
        data: {
            name: req.body.foldername,
            userId: req.user.id
        }
    })
    res.redirect("/dashboard")
}

const deleteFolder = async (req, res) => {
    const folderId = req.params.folderId;
    await prisma.folder.delete({
        where: { id: parseInt(folderId) },
        include: { files: true }
    })
    res.redirect("/dashboard")
}

module.exports = {
    getFolder,
    createFolder,
    deleteFolder
}