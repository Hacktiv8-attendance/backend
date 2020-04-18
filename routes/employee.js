const router = require('express').Router()
const EmployeeController = require('../controllers/EmployeeController')
const authentication = require('../middlewares/authentication')

router.post('/login', EmployeeController.login)
router.post('/QR', EmployeeController.sendQR)

router.use(authentication)

router.post('/sendQr', EmployeeController.sendQR)

module.exports = router