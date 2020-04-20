const AdminController = require('../controllers/AdminController')
const MessageController = require('../controllers/MessageController')
const router = require('express').Router()
const authentication = require('../middlewares/authentication')
const multer = require('multer')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')
const moment = require('moment')

const s3 = new aws.S3();

aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY,
  region: 'ap-southeast-1'
})
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'photos-hrq-upload',
    key: (req, file, cb) => {
      cb(null, "upload/" + moment(new Date()) + file.originalname)
    }
  })
})

router.post('/login', AdminController.login)
router.post('/upload', upload.single('image'), AdminController.uploadImage)

router.use(authentication)

router.get('/QR', AdminController.generateQR)

router.post('/message', MessageController.create)
router.get('/message', MessageController.findAll)
router.put('/message/:id', MessageController.update)
router.delete('/message/:id', MessageController.delete)

router.get('/absence', AdminController.findAbsencePerMonth)

router.get('/employee', AdminController.findAll)
router.post('/employee', AdminController.addEmployee)
router.put('/employee/:id', AdminController.updateEmployee)
router.delete('/employee/:id', AdminController.deleteEmployee)

module.exports = router
