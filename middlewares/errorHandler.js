module.exports = function(err, req, res, next) {
    if(err.name == 'JsonWebTokenError') {
        res.status(401).json({ message: `You Dont Have Authorization`})
    } else if (err.name == 'SequelizeValidationError') {
        let errors = err.errors.map(el => el.message)
        res.status(400).json({ 
            message: 'Bad Request',
            errors
         })
    } else if(err.name === 'SequelizeUniqueConstraintError') {
        let errors = err.errors.map(el => el.message)
        res.status(400).json({ 
            message: 'Bad Request',
            errors
         })
    }
    else res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' })
}