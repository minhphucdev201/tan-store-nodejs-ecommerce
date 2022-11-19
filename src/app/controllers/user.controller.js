const usersModel = require("../models/users.model");
const usersService = require("../services/users.service");
const rolesService = require("../services/roles.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
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

// Change Password
exports.changePassword = async (req, res, next) => {
  try {
    const id = req.body.id;
    let values = req.body;
    const change = await usersService.changePassword(id, values);
    console.log(change);
    if (change) {
      return res.status(200).json({ code: "200", message: "Update success!" });
    }
    return res.status(401).json({ code: "401", message: "wrong password" });
  } catch (err) {
    console.log(err);
  }
};

// forgot password
exports.forgotpassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await usersService.getByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ code: "401", message: "Account does not exist" });
    }

    jwt.sign(
      { userId: user[0].id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m" /*<---- this is 5 minutes */,
      },
      (err) => {
        if (err) {
          console.log("Token sign failed");
        } else {
          var transporter = nodemailer.createTransport({
            // config mail server
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            service: "gmail",
            auth: {
              user: "minhphuc201.dev@gmail.com",
              pass: "mxmdublvlqwkctlh",
            },
          });

          var mainOptions = {
            from: "minhphuc201.dev@gmail.com",
            to: user[0].email,
            subject: `Kính gửi Ông/Bà ${user[0].fullName}.`,
            text: `Xác nhận`,
            html: `<h4>SmartSign - Khôi phục mật khẩu</h4>
                    <body style="background:#e1e5e8" style="margin-top:0 ;margin-bottom:0 ;margin-right:0 ;margin-left:0 ;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;background-color:#e1e5e8;">
            
                    <center style="width:100%;table-layout:fixed;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#e1e5e8;">
                    <div style="max-width:600px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;">
                        <table align="center" cellpadding="0" style="border-spacing:0;font-family:'Muli',Arial,sans-serif;color:#333333;Margin:0 auto;width:100%;max-width:600px;">
                        <tbody>
                            <tr>
                            <td align="center" class="vervelogoplaceholder" height="143" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;height:143px;vertical-align:middle;" valign="middle"><span class="sg-image" data-imagelibrary="%7B%22width%22%3A%22160%22%2C%22height%22%3A34%2C%22alt_text%22%3A%22Verve%20Wine%22%2C%22alignment%22%3A%22%22%2C%22border%22%3A0%2C%22src%22%3A%22https%3A//marketing-image-production.s3.amazonaws.com/uploads/79d8f4f889362f0c7effb2c26e08814bb12f5eb31c053021ada3463c7b35de6fb261440fc89fa804edbd11242076a81c8f0a9daa443273da5cb09c1a4739499f.png%22%2C%22link%22%3A%22%23%22%2C%22classes%22%3A%7B%22sg-image%22%3A1%7D%7D"><a href="#" target="_blank"><img alt="Verve Wine" height="34" src="https://cf.shopee.vn/file/a56d5642e03ffd3442a0448995416f05_tn" style="border-width: 0px; width: 160px; height: 34px;" width="160"></a></span></td>
                            </tr>
                            <!-- Start of Email Body-->
                            <tr>
                            <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;background-color:#ffffff;">
                                <!--[if gte mso 9]>
                                    <center>
                                    <table width="80%" cellpadding="20" cellspacing="30"><tr><td valign="top">
                                    <![endif]-->
                                <table style="border-spacing:0;" width="100%">
                                <tbody>
                                    <tr>
                                    <td align="center" class="inner" style="padding-top:15px;padding-bottom:15px;padding-right:30px;padding-left:30px;" valign="middle"><span class="sg-image" data-imagelibrary="%7B%22width%22%3A%22255%22%2C%22height%22%3A93%2C%22alt_text%22%3A%22Forgot%20Password%22%2C%22alignment%22%3A%22%22%2C%22border%22%3A0%2C%22src%22%3A%22https%3A//marketing-image-production.s3.amazonaws.com/uploads/35c763626fdef42b2197c1ef7f6a199115df7ff779f7c2d839bd5c6a8c2a6375e92a28a01737e4d72f42defcac337682878bf6b71a5403d2ff9dd39d431201db.png%22%2C%22classes%22%3A%7B%22sg-image%22%3A1%7D%7D"><img alt="Forgot Password" class="banner" height="93" src="https://marketing-image-production.s3.amazonaws.com/uploads/35c763626fdef42b2197c1ef7f6a199115df7ff779f7c2d839bd5c6a8c2a6375e92a28a01737e4d72f42defcac337682878bf6b71a5403d2ff9dd39d431201db.png" style="border-width: 0px; margin-top: 30px; width: 255px; height: 93px;" width="255"></span></td>
                                    </tr>
                                    <tr>
                                    <td class="inner contents center" style="padding-top:15px;padding-bottom:15px;padding-right:30px;padding-left:30px;text-align:left;">
                                        <center>
                                        <p class="h1 center" style="Margin:0;text-align:center;font-family:'flama-condensed','Arial Narrow',Arial;font-weight:100;font-size:30px;Margin-bottom:26px;">Quên mật khẩu?</p>
                                        <!--[if (gte mso 9)|(IE)]><![endif]-->
                
                                        <p class="description center" style="font-family:'Muli','Arial Narrow',Arial;Margin:0;text-align:center;max-width:320px;color:#a1a8ad;line-height:24px;font-size:15px;Margin-bottom:10px;margin-left: auto; margin-right: auto;"><span style="color: rgb(161, 168, 173); font-family: Muli, Arial; font-size: 15px; text-align: center; background-color: rgb(255, 255, 255);">Đừng lo lắng! Hãy truy cập vào đây để khôi phục mật khẩu</span></p>
                                        <!--[if (gte mso 9)|(IE)]><br>&nbsp;<![endif]--><span class="sg-image" data-imagelibrary="%7B%22width%22%3A%22260%22%2C%22height%22%3A54%2C%22alt_text%22%3A%22Reset%20your%20Password%22%2C%22alignment%22%3A%22%22%2C%22border%22%3A0%2C%22src%22%3A%22https%3A//marketing-image-production.s3.amazonaws.com/uploads/c1e9ad698cfb27be42ce2421c7d56cb405ef63eaa78c1db77cd79e02742dd1f35a277fc3e0dcad676976e72f02942b7c1709d933a77eacb048c92be49b0ec6f3.png%22%2C%22link%22%3A%22%23%22%2C%22classes%22%3A%7B%22sg-image%22%3A1%7D%7D">
                                        <a href="" target="_blank"><button alt="Reset your Password" height="54"  style="border-width: 0px;cursor: pointer;background-color: #000 ;color: #eee;margin-top: 30px; margin-bottom: 50px; width: 260px; height: 54px;" width="260">Khôi phục mật khẩu</button></a></span>
                                         </span>
                                        <!--[if (gte mso 9)|(IE)]><br>&nbsp;<![endif]--></center>
                                    </td>
                                    </tr>
                                </tbody>
                                </table>
                                <!--[if (gte mso 9)|(IE)]>
                                    </td></tr></table>
                                    </center>
                                    <![endif]-->
                            </td>
                            </tr>
                            <!-- End of Email Body-->
                            
                        </tbody>
                        </table>
                    </div>
                    </center>
            
                
                </body>
                    `,
          };

          transporter.sendMail(mainOptions, function (err, info) {
            if (err) {
              console.log(err);
              return res.status(404).json(`can't send mail`);
            } else {
              return res
                .status(200)
                .json({ code: "200", "Message sent: ": info.response });
            }
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};
