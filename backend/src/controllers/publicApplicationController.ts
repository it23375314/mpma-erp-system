import { Request, Response } from 'express';
import { Op } from 'sequelize';
import SlpaEmployee from '../models/SlpaEmployee';
import { ApplicationValidationError, createStudentApplication } from '../services/studentApplicationService';

export const searchSlpaEmployee = async (req: Request, res: Response) => {
  const query = String(req.query.query || '').trim();
  if (!query || query.length > 50) return res.status(400).json({ success: false, message: 'Enter a valid service number, EPF number or NIC.' });
  const employee = await SlpaEmployee.findOne({ where: { active: true, [Op.or]: [{ serviceNumber: query }, { epfNumber: query }, { nic: query }] }, attributes: { exclude: ['active', 'createdAt', 'updatedAt'] } });
  if (!employee) return res.status(404).json({ success: false, message: 'No active SLPA employee was found.' });
  return res.json({ success: true, employee });
};

export const submitPublicApplication = async (req: Request, res: Response) => {
  try {
    const result = await createStudentApplication(req.body, (req.files as Express.Multer.File[]) || [], 'STUDENT_SELF');
    return res.status(201).json({ success: true, message: 'Application submitted successfully', ...result, status: 'PENDING_REVIEW' });
  } catch (error) {
    if (error instanceof ApplicationValidationError) return res.status(400).json({ success: false, message: error.message, fields: error.fields });
    console.error('Application submission failed:', error);
    return res.status(500).json({ success: false, message: 'Unable to submit the application.' });
  }
};
