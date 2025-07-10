import jwt from 'jsonwebtoken'

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = decoded;
      next();
    } catch (err) {
      console.error('JWT Error:', err.message);
      res.status(401).json({ message: 'Invalid Token' });
    }
  };
};

