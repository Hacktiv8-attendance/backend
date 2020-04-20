const { Message } = require('../models')

class MessageController {
  static create(req, res, next) {
    const { message } = req.body
    Message.create({message})
      .then(response => {
        res.status(201).json(response)
      })
      .catch(next)
  }
  static findAll(req, res, next) {
    Message.findAll({
      limit: 5
    })
      .then(response => {
        res.status(200).json(response)
      })
      .catch(next)
  }
  static update(req, res, next) {
    const { message } = req.body
    Message.update({message}, {
      where: {
        id: +req.params.id
      },
      returning: true
    })
      .then(response => {
        if(response) res.status(200).json(response[1][0])
        else next({ status: 404, message: "Message Not Found" })
      })
      .catch(next)
  }
  static delete(req, res, next) {
    Message.destroy({
      where: {
        id: +req.params.id
      }
    })
    .then(response => {
      if(response) res.status(200).json({message: "Message Deleted"})
      else next({ status: 404, message: "Message Not Found" })
    })
    .catch(next)
  }
}

module.exports = MessageController