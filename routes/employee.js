const router = require('express').Router()
const EmployeeController = require('../controllers/EmployeeController')
const authentification = require('../middlewares/authentication')

router.post('/login', EmployeeController.login)
router.post('/QR', EmployeeController.sendQR)

router.use(authentification)

router.post('/sendQr', EmployeeController.sendQR)

module.exports = router