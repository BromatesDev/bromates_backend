import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware to handle role-based access control
export const authMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; roles: string[] };
      req.user = decoded;


      if (!roles.some(role => decoded.roles.includes(role))) {
        console.log('Access denied. User roles:', decoded.roles, 'Required roles:', roles);
        return res.status(403).json({ message: 'Access denied', userRoles: decoded.roles, requiredRoles: roles });
      }
      next();
    } catch (error) {
      console.log('Invalid token:', error);
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};
