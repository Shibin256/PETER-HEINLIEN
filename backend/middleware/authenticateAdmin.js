// import adminModel from "../models/adminModel.js";
// import jwt from 'jsonwebtoken'

// /**
//  * Middleware to authenticate and authorize admin access
//  * This handles both authentication (verifying identity) and
//  * authorization (verifying admin status)
//  */
// export const authenticateAdmin = async (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '')

//     if (!token) {
//         return res.status(401).json({ message: 'Authentication token required' })
//     }

//     try {
//         // Authentication - Verify token and get admin ID
//         const verify = jwt.verify(token, process.env.JWT_SECRET)
//         const admin = await adminModel.findById(verify.adminId).select('-password')

//         if (!admin) {
//             return res.status(401).json({ message: 'Admin not found' })
//         }

//         // At this point, we've verified this is a valid admin
//         // The mere existence of the admin in the database is our authorization
//         // since you only have one admin

//         // Attach admin to request for use in route handlers
//         req.admin = admin
//         next();
//     } catch (err) {
//         return res.status(401).json({ message: 'Invalid authentication token' })
//     }
// }

// //admin authorization
// export const checkAdminAuth = (req, res, next) => {
//     if (!req.admin) {
//       return res.status(401).json({ message: 'you are not an admin,Authentication required' });
//     }
//     next();
//   };
  

export const verifyAdmin = (req, res, next) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
};
