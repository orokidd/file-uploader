import { prisma } from '../app.js';

const redirectIndex = (req, res) => {
    res.redirect("/dashboard");
}

const getDashboard = async (req, res) => {
    const user = req.user;
    const files = await prisma.file.findMany({
        where: { userId: user.id }
    });
    const folders = await prisma.folder.findMany({
        where: { userId : user.id }
    })
    res.render("dashboard", { user, files, folders }); 
}

export default {
    redirectIndex,
    getDashboard
}