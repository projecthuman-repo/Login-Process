const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { firstName, lastName, username, password, email, phoneNumber } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    firstName,
    lastName,
    username,
    passwordHash,
    email,
    phoneNumber
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter