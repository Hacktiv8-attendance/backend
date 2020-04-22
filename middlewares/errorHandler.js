module.exports = function(err, req, res, next) {
    /* istanbul ignore next */ 
    if(err.name == 'JsonWebTokenError') {
        res.status(401).json({ message: `You Dont Have Authorization`})
    } else if (err.name == 'SequelizeValidationError') {
        let errors = err.errors.map(el => el.message)
        res.status(400).json({ 
            message: 'Bad Request',
            errors
         })
    /* istanbul ignore next */ 
    } else if(err.name === 'SequelizeUniqueConstraintError') {
          /* istanbul ignore next */ 
        let errors = err.errors.map(el => el.message)
          /* istanbul ignore next */ 
        res.status(400).json({ 
            message: 'Bad Request',
            errors
         })
    }
    else res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' })
}