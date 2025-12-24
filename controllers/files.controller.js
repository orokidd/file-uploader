const prisma = require("../config/prisma.js");
const supabase = require("../config/supabase.js")
const helper = require("../helpers/helpers.js")


const uploadFile = async (req, res) => {
    const file = req.file;

    if(!file) {
        return res.status(400).send("No file selected")
    }

    // Create unique filename
    const filePath = `${req.user.id}-${req.user.username}/${Date.now()}-${file.originalname}`

    // Upload file to Supabase
    const { data, error } = await supabase.storage.from("orokidd-study").upload(filePath, file.buffer)

    if (error) {
        return res.status(500).send("Server error: Upload failed")
    }

    // Get public URL of the uploaded file
    const { data: publicData } = supabase.storage.from("orokidd-study").getPublicUrl(filePath, { download: true })

    // Save data to database
    try {
        await prisma.file.create({
            data: {
                // use the Supabase path as the stored name (memory storage doesn't provide `filename`)
                name: filePath,
                originalName: req.file.originalname,
                size: req.file.size,
                url: publicData?.publicUrl || null,
                mimetype: req.file.mimetype,
                userId: req.user.id
            }
        })

        res.redirect("/dashboard");
    } catch (err) {
        console.error('Error saving file record:', err)
        return res.status(500).send('Server error: could not save file record')
    }
}

const uploadFileToFolder = async (req, res) => {
    const folderId = req.params.folderId
    const file = req.file;

    if(!file) {
        return res.status(400).send("No file selected")
    }

    const filePath = `${req.user.id}-${req.user.username}/${Date.now()}-${file.originalname}`

    const { data, error } = await supabase.storage.from("orokidd-study").upload(filePath, file.buffer)
    
    if (error) {
        return res.status(500).send("Server error: Upload failed")
    }

    const { data: publicData } = supabase.storage.from("orokidd-study").getPublicUrl(filePath, { download: true })

    try {
        await prisma.file.create({
        data: {
            name: filePath,
            originalName: req.file.originalname,
            size: req.file.size,
            url: publicData?.publicUrl || null,
            mimetype: req.file.mimetype,
            userId: req.user.id,
            folderId: parseInt(folderId)
        }
    })

    res.redirect(`/folders/${folderId}`)

    } catch (err) {
        console.error('Error saving file record:', err)
        return res.status(500).send('Server error: could not save file record')
    }
}

const getFileDetails = async (req, res) => {
    const fileId = req.params.fileId
    const file = await prisma.file.findUnique({
        where: { id: parseInt(fileId)}
    })

    const formatBytes = helper.formatBytes
    const formatDate = helper.formatDate
    
    res.render("./file/file", { user: req.user, file, formatBytes, formatDate })
}

// const downloadFile = async (req, res) => {
//     const fileId = req.params.fileId
//     const file = await prisma.file.findUnique({
//         where: { id: parseInt(fileId) }
//     })
//     res.download(`uploads/${file.name}`)
// }

const deleteFile = async (req, res) => {
    const fromPage = req.query.from
    const fileId = req.params.fileId;
    const file = await prisma.file.findUnique({
        where: { id: parseInt(fileId) }
    })

    // Delete the actual file from supabase storage
    const { data, error } = await supabase.storage.from('orokidd-study').remove([`${file.name}`])

    if (error) {
        return res.status(500).send("Server error: File deletion failed")
    }

    // Delete the file record from database
    await prisma.file.delete({
        where: { id: parseInt(fileId) }
    })

    // Return to folder when deleting file inside a folder
    if (fromPage === "folder") {
        const folderId = file.folderId

        return res.redirect(`/folders/${folderId}`)
    }

    res.redirect("/dashboard")
}

module.exports = {
    uploadFile,
    uploadFileToFolder,
    getFileDetails,
    deleteFile
}