const customersService = require("../services/customers.service");
const customersModel = require("../models/customers.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

let refreshTokens = [];
exports.getAll = async (req, res) => {
  try {
    const ListCustomers = await customersService.getAll();
    return res
      .status(200)
      .json({ code: "200", message: "sucsses", data: ListCustomers });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const ListCustomer = await customersService.getById(id);
    return res
      .status(200)
      .json({ code: "200", message: "sucsses", data: ListCustomer });
  } catch (err) {
    res.send(err);
    // console.log(err);
  }
};

// CHANGE INFOR CUSTOMER
exports.changeInfor = async (req, res, next) => {
  try {
    const id = req.body;
    const values = req.body;
    const customer = await customersService.update(id, values);
    return res
      .status(200)
      .json({ code: "200", message: "sucsses", data: customer });
  } catch (err) {
    res.send(err);
    // console.log(err);
  }
};

// Register Customer
exports.Register = async (req, res, next) => {
  try {
    const values = req.body;

    // add Customer
    const addCustomer = customersService.createNew(values);
    if (addCustomer) {
      return res
        .status(200)
        .json({ code: "200", message: "Add Customer success" });
    }
    return res
      .status(404)
      .json({ code: "404", message: "Register Customer fail" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Login Customer
exports.Login = async (req, res, next) => {
  try {
    const user = await customersModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ code: "404", message: "Wrong Email!" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(404).json({ code: "404", message: "Wrong Password!" });
    }
    if (user && validPassword) {
      const accessToken = jwt.sign(
        {
          id: user.id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      const refreshToken = jwt.sign(
        {
          id: user.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "30d" }
      );
      refreshTokens.push(refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      const { password, ...others } = user._doc;
      res.status(200).json({
        code: "200",
        message: "Successfully",
        ...others,
        accessToken,
      });
    }
  } catch (error) {
    res.status(500).json({ code: "500", message: "Can't Login", error });
  }
};

// Refresh Token
module.exports.refreshToken = async (req, res) => {
  // take refresh token from customer
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json("You're not authenticated");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh Token is not valid");
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
    }
    // filter to get new refresh token
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    // Create new accessToken
    const newAccessToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    // Create new refresh token
    const newRefreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "365d" }
    );
    refreshTokens.push(newRefreshToken);
    // save refreshToken into cookies
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    return res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  });
};

// LOGOUT User
module.exports.Logout = async (req, res) => {
  res.clearCookie("refreshToken");
  refreshTokens = refreshTokens.filter(
    (token) => token !== req.cookies.refreshToken
  );
  return res.status(200).json({ message: "Logged Out!" });
};
