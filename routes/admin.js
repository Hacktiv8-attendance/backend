const AdminController = require('../controllers/AdminController')
const router = require('express').Router()
const authentification = require('../middlewares/authentication')
router.post('/login', AdminController.login)

router.use(authentification)

router.get('/employee', AdminController.findAll)
router.post('/employee', AdminController.addEmployee)
router.post('/employee/:id', AdminController.addEmployee)

module.exports = router
