const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual JWT secret
    req.user = decoded; // Attach decoded payload to request object
    next();
  } catch (err) {
    console.error('Token validation failed:', err.message);
    res.status(403).json({ message: 'Failed to authenticate token' });
  }
};

module.exports = verifyToken;
