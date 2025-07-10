import jwt from 'jsonwebtoken';

export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token starts with Bearer
  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401); // Unauthorized
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];
  // Verify token
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.userId = decoded.id;
    next();
  });
};
