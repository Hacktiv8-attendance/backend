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
      limit: 5,
      order: [['id', 'DESC']]
    })
      .then(response => {
        res.status(200).json(response)
      })
      .catch(next)
  }
  static update(req, res, next) {
    const { message } = req.body
    console.log(message)
    Message
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(messageEmployee => {
        if(messageEmployee) {
          return Message.update({message}, {
            where: {
              id: req.params.id
            },
            returning: true
          })
        } else {
          next({ status: 404, message: "Message Not Found" })
        }
      })
      .then(response => {
        if(response) res.status(200).json(response[1][0])
      })
      .catch(next)
  }
  static delete(req, res, next) {
    Message
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then (message => {
        if(message) {
          return Message.destroy({
            where: {
              id: +req.params.id
            }
          })
        } else {
          next({ status: 404, message: "Message Not Found" })
        }
      })
    .then(response => {
        res.status(200).json({message: "Message Deleted"})
    })
    .catch(next)
  }
}

module.exports = MessageController