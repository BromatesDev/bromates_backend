import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/users';

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, username, password, role } = req.body;

    console.log("Register request received with data:", { name, email, username, role });

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new UserModel({
      name,
      email,
      username,
      password: hashedPassword,
      roles: [role]
    });

    await newUser.save();


    // Create JWT token
    const token = jwt.sign({ userId: newUser._id, roles: newUser.roles }, process.env.JWT_SECRET as string, {
      expiresIn: '100h'
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      roles: newUser.roles
    });
  } catch (error) {
    console.error('Error occurred during registration:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid email' });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid Password' });
      return;
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id, roles: user.roles }, process.env.JWT_SECRET as string, {
      expiresIn: '1000h'
    });
    const { password: _, ...userWithoutPassword } = user.toObject();

    if (user.firstLogin) {
      user.firstLogin = false; // Update the firstLogin flag
      await user.save(); // Save the updated user to the database
    }

    res.status(200).json({ message: 'Login successful', token, user: userWithoutPassword, roles: user.roles });
  } catch (error) {
    console.error('Error occurred during login:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Switch role
export const switchRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, newRole } = req.body;

    // Validate new role
    if (!['student', 'tenant', 'landlord', 'admin'].includes(newRole)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Find and update user role
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent switching to admin if not already an admin
    if (newRole === 'admin' && !user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Only admins can switch to admin role' });
    }

    // Add new role if not already present
    if (!user.roles.includes(newRole)) {
      user.roles.push(newRole);
    }

    await user.save();

    // Generate new JWT token
    const token = jwt.sign({ userId: user._id, roles: user.roles }, process.env.JWT_SECRET as string, {
      expiresIn: '1h'
    });

    console.log(`Current role: ${user.roles}`);
    
    res.status(200).json({
      message: `Role ${newRole} added for user ID: ${user._id}`,
      token,
      roles: user.roles,
      currentRole: newRole
    });
  } catch (error) {
    console.error('Error occurred during role switch:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
