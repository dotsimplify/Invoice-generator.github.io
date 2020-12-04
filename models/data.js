var mongoose = require("mongoose");
var Schema = new mongoose.Schema();
mongoose.connect("process.env.port || mongodb://localhost:27017/database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("mongo Db connected");
});

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    createIndexes: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date(),
  },
});

var userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
