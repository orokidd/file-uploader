const errorHandler = {
    notFound: (req, res, next) => {
        res.status(404).render("./error/error", {
            message: "Page not found"
        })
    },

    serverError: (err, req, res, next) => {
        res.status(500).render("./error/error", {
            message: "Server error occurred"
        })
    }
}

export default errorHandler;