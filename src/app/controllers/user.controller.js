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
    const id = req.params.id;
    if (id == "6377d09cfb12e6eafc8d1a11") {
      return res
        .status(501)
        .json({ code: "501", message: "không thể xóa role admin" });
    }
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
            html: `<body  style="margin-top:0 ;margin-bottom:0 ;margin-right:0 ;margin-left:0 ;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px">
            
                    <center style="width:100%;table-layout:fixed;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;margin-top:30px">
                    <div style="max-width:580px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;">
                        <table align="center" cellpadding="0" style="border-spacing:0;font-family:'Muli',Arial,sans-serif;color:#333333;Margin:0 auto;width:100%;max-width:600px;">
                        <tbody>
                            <tr>
                            <td align="center" class="vervelogoplaceholder" height="143" style="padding-top:0;padding-bottom:40px;padding-right:0;padding-left:0;height:143px;vertical-align:middle;" valign="middle"><span class="sg-image" data-imagelibrary="%7B%22width%22%3A%22160%22%2C%22height%22%3A34%2C%22alt_text%22%3A%22Verve%20Wine%22%2C%22alignment%22%3A%22%22%2C%22border%22%3A0%2C%22src%22%3A%22https%3A//marketing-image-production.s3.amazonaws.com/uploads/79d8f4f889362f0c7effb2c26e08814bb12f5eb31c053021ada3463c7b35de6fb261440fc89fa804edbd11242076a81c8f0a9daa443273da5cb09c1a4739499f.png%22%2C%22link%22%3A%22%23%22%2C%22classes%22%3A%7B%22sg-image%22%3A1%7D%7D"><a href="#" target="_blank"><img alt="Herbal oil" height="34" src="https://cf.shopee.vn/file/a56d5642e03ffd3442a0448995416f05_tn" style="border-width: 0px; width: 300px; height: 180px;" ></a></span></td>
                            </tr>
                            <!-- Start of Email Body-->
                            <tr>
                                <td style="text-align: center;margin-top:14px"><a href="" style="font-size: 24px;font-weight:700;letter-spacing:0.5px;text-decoration: none;color:#000000;">KHÔI PHỤC MÂT KHẨU</a></td>
                            </tr>
                            <tr>
                            <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;background-color:#ffffff;">
                                <!--[if gte mso 9]>
                                    <center>
                                    <table width="80%" cellpadding="20" cellspacing="30"><tr><td valign="top">
                                    <![endif]-->
                                <table style="border-spacing:0;" width="100%">
                                <tbody>
                                   <tr>
                                    <td><p>Gửi: ${user[0].fullName}</p></td>
                                   </tr>
                                    <tr>
                                    <td class="inner contents center" style="">
                                    <center>
                                     <!--[if (gte mso 9)|(IE)]><![endif]-->
                                            <p style="font-size: 14px;line-height: 1.4;text-align:left" >Chúng tôi nhân được yêu cầu đăt lại mât khẩu của bạn. Vui long nhấp vào liên kết bên dưới để thiết lập lại mật khẩu của ban!!!</p>
                                        <div style="text-align:center;">
<a href="" target="_blank" style="text-decoration: none;"><button alt="Reset your Password" height="54"  style="text-align: center;border:none;outline: none;cursor: pointer;background-color: #2E7D32 ;border-radius: 10px;color: #ffffff;font-weight: 700;margin-top: 12px;margin-bottom: 20px; width: 300px; height: 42px" width="260">Khôi Phục Mật Khẩu</button></a>
                                        </div>
                                            
                                        <!--[if (gte mso 9)|(IE)]><br>&nbsp;<![endif]-->
                                    </center>
                                       
                                    </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p style="font-size: 14px;line-height: 1.4;">Nếu ban cần hỗ trơ thêm hoăc ban không thưc hiên thay đổi này, vui lòng liên hê: <span style="color:#2E7D32;text-decoration:underline;padding-bottom:2px;font-weight: 600;">minhphuc201.dev@gmail.com</span></p>
                                            <span style="font-weight: 700;font-size:18px" >Tâm An Nhiên Store</span>
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

// Reset Password
module.exports.resetPassword = async (req, res, next) => {
  const token = req.body.token;
  const password = req.body.password;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decode) => {
    if (err) {
      return res
        .status(401)
        .json({ code: 401, message: "Qúa thời hạn xác thực" });
    } else {
      const add = await usersService.NewPass(decode.userId, password);
      if (add) {
        return res
          .status(200)
          .json({ code: 200, message: "Xác thực thành công" });
      }
      return res
        .status(401)
        .json({ code: 401, message: "đổi mật khẩu thất bại" });
    }
  });
};
