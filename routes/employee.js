const router = require('express').Router()
const EmployeeController = require('../controllers/EmployeeController')
const authentication = require('../middlewares/authentication')

router.post('/login', EmployeeController.login)
router.post('/resetPassword',EmployeeController.resetPassword)

router.use(authentication)

router.post('/sendQR', EmployeeController.sendQR)
router.get('/absence', EmployeeController.findAbsence)
router.post('/paidLeave', EmployeeController.requestPaidLeave)
router.put('/paidLeave/:id', EmployeeController.updatePaidLeave)

router.get('/staffabsence', EmployeeController.findEmployeeAbsence)
module.exports = router