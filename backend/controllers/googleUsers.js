const googleUsersRouter = require('express').Router()
const GoogleUser = require('../models/googleUser')

googleUsersRouter.get('/', async (request, response) => {
  const googleUsers = await GoogleUser.find({})
  response.json(googleUsers)
})

googleUsersRouter.post('/', async (request, response) => {
  const { firstName, lastName, email, phoneNumber } = request.body

  const googleUser = new GoogleUser({
    firstName, lastName, email, phoneNumber
  })

  const savedGoogleUser = await googleUser.save()
  response.status(201).json(savedGoogleUser)
})

module.exports = googleUsersRouter