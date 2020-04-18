const router = require('express').Router()
const EmployeeController = require('../controllers/EmployeeController')

router.post('/login', EmployeeController.login)
router.post('/QR', EmployeeController.sendQR)

module.exports = router