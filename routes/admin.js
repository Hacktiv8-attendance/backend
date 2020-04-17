const AdminController = require('../controllers/AdminController')
const router = require('express').Router()

router.post('/login', AdminController.login)

router.post('/addEmployee', AdminController.addEmployee)

module.exports = router