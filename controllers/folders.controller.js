const prisma = require("../config/prisma.js");

const getFolder = async (req, res) => {
    const folderId = req.params.fodlerId;
    const user = req.user
    const folder = await prisma.folder.findUnique({
        where: { id: parseInt(folderId), userId: user.id }
    })

    const files = await prisma.file.findMany({
        where: { folderId: parseInt(folderId), userId: user.id }
    })

    res.render("folder", { user, folder, files })
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

module.exports = {
    getFolder,
    createFolder
}