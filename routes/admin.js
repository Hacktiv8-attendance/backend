const AdminController = require('../controllers/AdminController')
const router = require('express').Router()
const authentication = require('../middlewares/authentication')
const fs = require('fs')
const multer = require('multer')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')

const s3 = new aws.S3();

aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY,
  region: 'ap-southeast-1'
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'hrq-employee-photo',
    key: (req, file, cb) => {
      console.log(file)
      cb(null, new Date() + file.originalname)
    }
  })
})

router.post('/login', AdminController.login)
router.post('/upload', upload.single('image'), AdminController.uploadImage)

router.use(authentication)

router.get('/QR', AdminController.generateQR)
router.get('/employee', AdminController.findAll)
router.post('/employee', AdminController.addEmployee)
router.put('/employee/:id', AdminController.updateEmployee)
router.delete('/employee/:id', AdminController.deleteEmployee)

module.exports = router
