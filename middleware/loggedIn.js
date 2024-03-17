
const jwt = require('jsonwebtoken');
const { PLATFORM } = require('../constants/auth');

const clientSecret = require('../constants/auth').JWT.CLIENT_SECRET;

const authenticateJWT = platform => (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.unAuthorized();
  }

  const token = authHeader.split(' ')[1];
  let secret = '';

  if (platform === PLATFORM.CLIENT) {
    secret = clientSecret;
  }

  jwt.verify(token, secret, (error, user) => {
    if (error) {
      return res.unAuthorized();
    }

    req.user = user;
    next();
  });
};