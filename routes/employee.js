const router = require('express').Router()
const EmployeeController = require('../controllers/EmployeeController')
const MessageController = require('../controllers/MessageController')

const authentication = require('../middlewares/authentication')

router.post('/login', EmployeeController.login)
router.post('/findEmail', EmployeeController.findOne)
router.post('/requestCode', EmployeeController.requestResetPassword)
router.post('/resetPassword',EmployeeController.resetPassword)


router.use(authentication)

router.get('/message', MessageController.findAll)

router.post('/sendQR', EmployeeController.sendQR)

router.get('/absence', EmployeeController.findAbsence)

router.get('/paidLeave', EmployeeController.findPaidLeave)
router.post('/paidLeave', EmployeeController.requestPaidLeave)
router.put('/paidLeave/:id', EmployeeController.updatePaidLeave)

router.get('/staffabsence', EmployeeController.findAbsencePerMonth)
module.exports = router