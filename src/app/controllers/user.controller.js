const usersModel = require("../models/users.model");
const bcrypt = require("bcrypt");
// Get all user
module.exports.getAll = async (req, res) => {
  try {
    const listUser = await usersModel.find();
    return res
      .status(200)
      .json({ code: "200", message: "Success", data: listUser });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Delete user
module.exports.deleteUser = async (req, res, next) => {
  try {
    await usersModel.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ code: "200", message: "Delete Successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
//  Register User
exports.Register = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const newUser = await new usersModel({
      fullName: req.body.fullName,
      email: req.body.email,
      userName: req.body.userName,
      password: hash_password,
    });
    //save to DB
    const user = await newUser.save();
    return res
      .status(200)
      .json({ code: "200", message: "Create user successfully", user });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Login User

exports.Login = async (req, res, next) => {
  try {
    const user = await usersModel.findOne({ userName: req.body.userName });
    if (!user) {
      res.status(404).json({ code: "404", message: "Wrong username!" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(404).json({ code: "404", message: "Wrong Password!" });
    }
    if (user && validPassword) {
      res.status(200).json({ code: "200", message: "Successfully", user });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
