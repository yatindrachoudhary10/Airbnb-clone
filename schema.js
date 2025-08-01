//server side schema

const Joi = require('joi');
const review = require('./models/review');

module.exports.listingSchema = Joi.object({
  listing :Joi.object({                 // listing it self must be an object
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null)
  }).required(),       //whenever a request comes we supposed to be have listing object
});


module.exports.reviewSchema = Joi.object({
  review:Joi.object({
   rating: Joi.number().required().min(1).max(5),
   comment: Joi.string().required(), 
  }).required()
})