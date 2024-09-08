// src/routes/routes.ts
import express, { Router } from 'express';
import { register, login, switchRole } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';
import { testApi } from '../controllers/test';
import messageController from '../controllers/messageController'; 

const router: Router = express.Router();

/* Test */
router.get('/test', testApi);

/* Auth */
router.post('/register', register); // Route to handle user registration
router.post('/login', login); // Route to handle user login
router.post('/switch-role', authMiddleware(['student', 'tenant', 'landlord', 'admin']), switchRole); // Allow switching role if logged in

/* Protected Routes */
router.get('/student', authMiddleware(['student', 'tenant', 'landlord', 'admin']), (req, res) => res.send('Student, Tenant, Landlord, or Admin Access'));
router.get('/tenant', authMiddleware(['student', 'tenant','tenant', 'landlord', 'admin']), (req, res) => res.send('Tenant, Landlord, or Admin Access'));
router.get('/landlord', authMiddleware(['student', 'tenant','landlord', 'admin']), (req, res) => res.send('Landlord or Admin Access'));
router.get('/admin', authMiddleware(['admin']), (req, res) => res.send('Admin Access'));


/* Messaging Route */
router.use('/messages', messageController);


export default router;
