const jwt = require("jsonwebtoken");
module.exports = {
  signToken: (data) => {
    return jwt.sign(data, "SECRET");
  },
  verifyToken: (token) => {
    return jwt.verify(token, "SECRET");
  },
};
