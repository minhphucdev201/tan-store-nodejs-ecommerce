const jwt = require("jsonwebtoken");
// verifyToken  and Admin auth
const middlewareAuth = {
  // verifyToken
  checkAuthencation: (req, res, next) => {
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
  },
  // verifyToken && verifyAdmin
  checkAdmin: (req, res, next) => {
    middlewareAuth.checkAuthencation(req, res, () => {
      if (req.user.id == req.params.id || req.user.admin) {
        next();
      } else {
        res.status(403).json("You're not allowed delete orther");
      }
    });
  },
};

module.exports = middlewareAuth;
