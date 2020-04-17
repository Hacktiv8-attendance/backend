const AdminController = require('../controllers/AdminController')
const router = require('express').Router()

const authentication = require('../middlewares/authentication')

router.post('/login', AdminController.login)

router.use(authentication)

module.exports = router