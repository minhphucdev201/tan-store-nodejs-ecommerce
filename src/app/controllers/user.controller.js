const usersModel = require("../models/users.model");
const usersService = require("../services/users.service");
const rolesService = require("../services/roles.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let refreshTokens = [];
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

// GENERATE ACCESS TOKEN
module.exports.generateAcessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      admin: user.admin,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30s" }
  );
};
//  Register User
exports.Register = async (req, res, next) => {
  try {
    const values = req.body;
    // check username
    const checkUsername = await usersService.getByUserName(values.username);
    if (checkUsername) {
      return res
        .status(404)
        .json({ code: "404", message: "Username already exists" });
    }
    // check IdRole
    const checkIdRole = await rolesService.getById(values.roleId);
    if (!checkIdRole) {
      return res
        .status(404)
        .json({ code: "404", message: "IdRole does not exist" });
    }
    // add Adimin
    const addAdmin = usersService.createNew(values);
    if (addAdmin) {
      return res
        .status(200)
        .json({ code: "200", message: "Add Admin success" });
    }
    return res
      .status(404)
      .json({ code: "404", message: "register admin fail" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Login User
exports.Login = async (req, res, next) => {
  try {
    const user = await usersModel.findOne({ userName: req.body.userName });
    if (!user) {
      return res.status(404).json({ code: "404", message: "Wrong username!" });
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
          admin: user.admin,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      const refreshToken = jwt.sign(
        {
          id: user.id,
          admin: user.admin,
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
    res.status(500).json({ error: error });
  }
};

// Refresh Token
module.exports.refreshToken = async (req, res) => {
  // take refresh token from user
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
        admin: user.admin,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    // Create new refresh token
    const newRefreshToken = jwt.sign(
      {
        id: user.id,
        admin: user.admin,
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
