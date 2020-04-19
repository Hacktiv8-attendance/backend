const router = require('express').Router()
const EmployeeController = require('../controllers/EmployeeController')
const authentication = require('../middlewares/authentication')

router.post('/login', EmployeeController.login)

router.use(authentication)

router.post('/sendQR', EmployeeController.sendQR)
router.get('/absence/:id', EmployeeController.findAbsence)
router.get('/staffabsence/:id', EmployeeController.findEmployeeAbsence)
module.exports = router