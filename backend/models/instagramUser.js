const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const instagramUserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "A user must have a first name"],
    unique: false,
    //trim: true,
  },
  lastName: {
    type: String,
    required: [true, "A user must have a last name"],
    unique: false,
    //trim: true,
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
    //trim: true,
  },
  phoneNumber: {
    type: String,
    required: false,  // needs to be initialized after instagram sign in
    unique: true,
    sparse: true  // allows multiple null values and avoids 'E11000 duplicate key error collection' error.
  }, 
  username: {
    type: String,
    required: [true, "A user must have a username"],
    unique: true,
    sparse: true  // allows multiple null values and avoids 'E11000 duplicate key error collection' error.
  }, 
})

instagramUserSchema.plugin(uniqueValidator)

instagramUserSchema.set('toJSON', {  // stringifies and renames _id to id, does not show __v
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const InstagramUser = mongoose.model("InstagramUser", instagramUserSchema)

module.exports = InstagramUser