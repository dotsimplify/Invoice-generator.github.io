const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var invoiceSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date(),
  },
  clientName: String,
  clientAddress: String,
  clientName: String,
  clientAddress: String,
  invoiceNumber: Number,
  invoiceDate: String,
  product: {},
  subTotal: Number,
  gst: Number,
  totalAmount: Number,
  advance: Number,
  balancedue: Number,
});
invoiceSchema.plugin(mongoosePaginate);
var invoiceModel = mongoose.model("invoice", invoiceSchema);

module.exports = invoiceModel;
