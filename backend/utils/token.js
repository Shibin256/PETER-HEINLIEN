//jet token creating so it can use anyware by calling
import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  const payload = {
    id: user._id,
    role: user.isAdmin ? "admin" : "user",
  };

  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "60m",
  });
};

//refresh token creation
export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};
