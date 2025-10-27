import { Request, Response } from 'express';
import { body } from 'express-validator';
import { AdminAuthService } from '../services/adminAuthService';
import { handleValidationErrors } from '../middlewares/security';

export const login = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const authResponse = await AdminAuthService.loginAdmin(email, password);
      res.json(authResponse);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
];