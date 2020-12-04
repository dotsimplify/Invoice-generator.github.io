const express = require("express");
const fs = require("fs");
const app = express();
app.set("view engine", "ejs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const joi = require("joi");
const session = require("express-session");
const bodyParser = require("body-parser");
app.use(express.static(`${__dirname}/public/`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const userModel = require("./models/data");
const invoiceModel = require("./models/invoicedata");
const { signupAuth, loginAuth, invoiceAuth, Access } = require("./functions");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}
app.use(
  session({
    secret: "InvoiceGenerator",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
let port = process.env.port || 5000;
app.get("/signup", (req, res) => {
  res.render("signup.ejs", { title: "My Invoice", msg: "", error: "" });
});
app.post("/signup", urlencodedParser, async (req, res, next) => {
  try {
    const value = await signupAuth.validateAsync(req.body);
    var Password = value.Password;
    var cryptPassword = bcrypt.hashSync(Password, 10);
    var regData = new userModel({
      email: value.Email,
      password: cryptPassword,
      createdAt: Date(),
    });
    regData.save((err, doc) => {
      if (err) throw err;
      res.render("signup.ejs", {
        title: "My Invoice",
        error: "",
        msg: "User Registered Successfully",
      });
    });
  } catch (err) {
    console.log(err);
    res.render("signup.ejs", { title: "My Invoice", error: err, msg: "" });
  }
});

app.get("/", (req, res) => {
  res.render("index.ejs", { title: "My Invoice", msg: "", error: "" });
});
app.post("/", async (req, res, next) => {
  try {
    const result = await loginAuth.validateAsync(req.body);
    var getuser = userModel.findOne({ email: result.Email });
    getuser.exec((error, data) => {
      if (data === null) {
        res.render("index.ejs", {
          title: "Login",
          msg: "",
          error: "Invalid User Or Password !!",
        });
      } else {
        if (error) throw new error();
        var getId = data._id;
        var getPass = data.password;
        var user = data.email;
        bcrypt.compare(result.Password, getPass, (err, doc) => {
          if (err) throw err;
          if (doc) {
            var token = jwt.sign({ userID: getId }, "loginToken");
            localStorage.setItem("UserToken", token);
            localStorage.setItem("loginUser", result.Email);
            req.session.Email = result.Email;
            res.render("dashboard.ejs", {
              title: "My Invoice App",
              username: req.session.Email,
              msg: "Welcome to Dashboard",
              error: "",
            });
          } else
            res.render("index.ejs", {
              title: "My Invoice App",
              msg: " ",
              error: "Invalid Id or Password",
            });
        });
      }
    });
  } catch (error) {
    res.render("login", { title: "My Invoice App", msg: "", error: error });
  }
});
app.get("/create", Access, (req, res, next) => {
  res.render("invoice.ejs", { title: "My Invoice App", msg: "", error: "" });
});

app.post("/create", Access, async (req, res, next) => {
  try {
    const result = await invoiceAuth.validateAsync(req.body);
    const { clientName } = req.body;
    const { clientAddress } = req.body;
    const { invoiceNumber } = req.body;
    const { invoiceDate } = req.body;
    const { subTotal } = req.body;
    const { gst } = req.body;
    const { totalAmount } = req.body;
    const { advance } = req.body;
    const { balancedue } = req.body;
    let product = {};
    const invoiceEntry = new invoiceModel({
      clientName,
      clientAddress,
      invoiceNumber,
      invoiceDate,
      subTotal,
      gst,
      totalAmount,
      advance,
      balancedue,
      product: {
        itemName: req.body.itemName,
        description: req.body.description,
        itemPrice: req.body.itemPrice,
        qty: req.body.qty,
        price: req.body.Price,
      },
    });
    if (product.length > 0) {
      product.forEach((pdt) => {
        product = pdt;
      });
    }
    invoiceEntry.save((err, doc) => {
      if (err) throw err;
      res.render("invoice", {
        title: "MyInvoice App",
        msg: "Invoice generated successfully",
        error: "",
      });
    });
  } catch (error) {
    res.render("invoice", { title: "My Invoice App", msg: "", error: error });
  }
});

app.get("/invoicedetails", Access, (req, res, next) => {
  const options = {
    page: 1,
    limit: 5,
  };

  invoiceModel.paginate({}, options).then((result) => {
    res.render("invoiceList.ejs", {
      title: "My Invoice App",
      msg: "",
      records: result.docs,
      current: result.offset,
      pages: Math.ceil(result.total / result.limit),
    });
  });
});
app.get("/delete/:id", Access, (req, res, next) => {
  var id = req.params.id;
  var del = invoiceModel.findByIdAndDelete(id);
  del.exec(function (err, data) {
    if (err) throw err;
    res.redirect("/invoicedetails");
  });
});
app.get("/invoice/:id", Access, (req, res, next) => {
  const { id } = req.params;
  const invoice = invoiceModel.findById(id);
  invoice.exec((err, data) => {
    if (err) throw err;
    else {
      res.render("finalInvoice.ejs", { title: "View bill", records: data });
    }
  });
});
app.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err) throw err;
    else res.render("logout.ejs", { title: "My Invoice App" });
  });
});

app.listen(port, () => console.log("server running on " + port));
