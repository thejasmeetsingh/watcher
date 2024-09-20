import jwt from "jsonwebtoken";

const getSecretKey = () => {
  let secretKey = process.env.SECRET_KEY;

  if (!secretKey) {
    secretKey = "random-secret-123";
  }

  return secretKey;
};

export const verifyToken = (token: string) => {
  const secretKey = getSecretKey();

  try {
    const decoded = jwt.verify(token, secretKey);
    return { valid: true, decoded };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
};
