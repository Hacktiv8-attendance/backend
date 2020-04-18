const AdminController = require('../controllers/AdminController')
const router = require('express').Router()
const authentification = require('../middlewares/authentication')


router.post('/login', AdminController.login)

router.use(authentification)

router.get('/QR', AdminController.generateQR)
router.get('/employee', AdminController.findAll)
router.post('/employee', AdminController.addEmployee)
router.put('/employee/:id', AdminController.updateEmployee)
router.delete('/employee/:id', AdminController.deleteEmployee)

module.exports = router
