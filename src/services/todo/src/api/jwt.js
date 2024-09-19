const jwt = require("jsonwebtoken");

const getSecretKey = () => {
  let secretKey = process.env.SECRET_KEY;

  if (!secretKey) {
    secretKey = "random-secret-123";
  }

  return secretKey;
};

const verifyToken = (token) => {
  const secretKey = getSecretKey();

  try {
    const decoded = jwt.verify(token, secretKey);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

module.exports = verifyToken;
