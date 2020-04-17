const router = require('express').Router()
const EmployeeController = require('../controllers/EmployeeController')

router.post('/login', EmployeeController.login)

module.exports = router