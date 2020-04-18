const router = require('express').Router()

const adminRouter = require('./admin')
const employeeRouter = require('./employee')

router.use('/admin', adminRouter)
router.use('/employee', employeeRouter)

module.exports = router