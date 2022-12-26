const jwt = require("jsonwebtoken");
const rolesService = require("../services/roles.service");
// verifyToken  and Admin auth
// const middlewareAuth = {
//    verifyToken
//   checkAuthencation: (req, res, next) => {
//     const token = req.headers.token;
//     if (token) {
//       const accessToken = token.split(" ")[1];
//       jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) {
//           return res.status(403).json("Token is not valid");
//         }
//         req.user = user;
//         next();
//       });
//     } else {
//       return res.status(401).json({ message: "You're not authenticated" });
//     }
//   },
//   verifyToken && verifyAdmin
//   checkAdmin: (req, res, next) => {
//     middlewareAuth.checkAuthencation(req, res, () => {
//       if (req.user.id == req.params.id || req.user.admin) {
//         next();
//       } else {
//         res.status(403).json("You're not allowed delete orther");
//       }
//     });
//   },
//   checkRoleDelCata: async (req, res, next) => {
//     try {
//       const token = req.headers.token;
//       if (token) {
//         const accessToken = token.split(" ")[1];
//         const check = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
//         console.log("check", check);
//         const checkRole = await rolesService.getPermission(check.roleId);

//         const getPermission = checkRole.listPermissions.filter(
//           (item) => item.idPermissions == "6377c64a2a18b327a2590b59"
//         );
//         // console.log(getPermission);
//         if (getPermission[0].status) {
//           return next();
//         }
//         return res.json({ status: 403, message: "not authorization" });
//       } else {
//         return res.send("not token");
//       }
//     } catch (err) {
//       console.log(err);
//       return res.json({ status: 405, message: "Token verify failed" });
//       // return res.redirect('/users/login')
//     }
//   },
// };

// module.exports = middlewareAuth;

module.exports.checkAuthencation = async (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "You're not authenticated" });
  }
};

module.exports.checkRoleDelCata = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      const check = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      console.log("check", check);
      const checkRole = await rolesService.getPermission(check.roleId);
      const getPermission = checkRole.listPermissions.filter(
        (item) => item.idPermissions == "6377c64a2a18b327a2590b59"
      );
      console.log(getPermission[0].status);
      if (!getPermission[0].status) {
        return res
          .status(500)
          .json({ code: "403", message: "not authorization" });
      }
      return next();

      // return res.json({ status: 403, message: "not authorization" });
    } else {
      return res.status(403).json("not token");
    }
  } catch (err) {
    console.log(err);
    return res
      .status(405)
      .json({ status: 405, message: "Token verify failed" });
    // return res.redirect('/users/login')
  }
};
