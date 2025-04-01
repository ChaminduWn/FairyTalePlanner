// middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // You'll need to create this model

export const isAdmin = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};