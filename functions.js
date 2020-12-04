const joi = require("joi");
const userModel = require("../Invoice/models/data");

const signupAuth = joi.object({
  Email: joi.string().email().required().lowercase(),
  Password: joi.string().min(5).required(),
  confPassword: joi.ref("Password"),
});

const loginAuth = joi.object({
  Email: joi.string().email().required().lowercase(),
  Password: joi.string().required(),
});

const invoiceAuth = joi.object({
  clientName: joi.string().required(),
  clientAddress: joi.string().required(),
  invoiceNumber: joi
    .string()
    .max(6)
    .pattern(/^[0-9]+$/)
    .required(),
  invoiceDate: joi.string().required(),
  itemName: joi.array().items(joi.string()),
  description: joi.array().items(joi.string()),
  itemPrice: joi.array().items(joi.string()),
  qty: joi.array().items(joi.string()),
  Price: joi.array().items(joi.string()),
  subTotal: joi.number().required(),
  gst: joi.number().required(),
  totalAmount: joi.number().required(),
  advance: joi.number(),
  balancedue: joi.number().required(),
});

const Access = (req, res, next) => {
  if (req.session.Email == "") {
    res.redirect("/logout");
  }
  next();
};
module.exports = { signupAuth, loginAuth, invoiceAuth, Access };
