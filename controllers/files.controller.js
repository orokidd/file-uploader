const prisma = require("../config/prisma.js");
const supabase = require("../config/supabase.js")

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
    const { data: publicData } = supabase.storage.from("orokidd-study").getPublicUrl(filePath)

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

    const { data: publicData } = supabase.storage.from("orokidd-study").getPublicUrl(filePath)

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