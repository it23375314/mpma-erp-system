import { Request, Response } from 'express';
import { Lecturer } from '../models/Lecturer';
import { Batch } from '../models/Batch';
import { BatchLecturer } from '../models/BatchLecturer';
import { Course } from '../models/Course';

export const getLecturers = async (req: Request, res: Response) => {
  try {
    const lecturers = await Lecturer.findAll({
      order: [['fullName', 'ASC']]
    });
    res.status(200).json(lecturers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLecturerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lecturer = await Lecturer.findByPk(req.params.id as string);
    if (!lecturer) {
      res.status(404).json({ message: 'Lecturer not found' });
      return;
    }
    res.status(200).json(lecturer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createLecturer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, nicPassport } = req.body;

    // Check unique email
    const emailExist = await Lecturer.findOne({ where: { email } });
    if (emailExist) {
      res.status(400).json({ message: `Lecturer with email "${email}" already exists` });
      return;
    }

    // Check unique nicPassport
    const nicExist = await Lecturer.findOne({ where: { nicPassport } });
    if (nicExist) {
      res.status(400).json({ message: `Lecturer with NIC/Passport "${nicPassport}" already exists` });
      return;
    }

    const lecturer = await Lecturer.create(req.body);
    res.status(201).json(lecturer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLecturer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lecturer = await Lecturer.findByPk(id as string);
    if (!lecturer) {
      res.status(404).json({ message: 'Lecturer not found' });
      return;
    }

    const { email, nicPassport } = req.body;

    if (email && email !== lecturer.email) {
      const emailExist = await Lecturer.findOne({ where: { email } });
      if (emailExist) {
        res.status(400).json({ message: `Lecturer with email "${email}" already exists` });
        return;
      }
    }

    if (nicPassport && nicPassport !== lecturer.nicPassport) {
      const nicExist = await Lecturer.findOne({ where: { nicPassport } });
      if (nicExist) {
        res.status(400).json({ message: `Lecturer with NIC/Passport "${nicPassport}" already exists` });
        return;
      }
    }

    await lecturer.update(req.body);
    res.status(200).json(lecturer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const toggleLecturerStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lecturer = await Lecturer.findByPk(id as string);
    if (!lecturer) {
      res.status(404).json({ message: 'Lecturer not found' });
      return;
    }

    const newStatus = lecturer.status === 'Active' ? 'Inactive' : 'Active';
    await lecturer.update({ status: newStatus });
    res.status(200).json(lecturer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Batch assignments logic
export const assignLecturerToBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { batchId, lecturerId } = req.body;

    // Validate if batch exists
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      res.status(404).json({ message: 'Batch not found' });
      return;
    }

    // Validate if lecturer exists
    const lecturer = await Lecturer.findByPk(lecturerId);
    if (!lecturer) {
      res.status(404).json({ message: 'Lecturer not found' });
      return;
    }

    // Check if assignment already exists
    const existing = await BatchLecturer.findOne({ where: { batchId, lecturerId } });
    if (existing) {
      res.status(400).json({ message: 'This lecturer is already assigned to this batch' });
      return;
    }

    const assignment = await BatchLecturer.create({ batchId, lecturerId });
    res.status(201).json(assignment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const removeLecturerFromBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { batchId, lecturerId } = req.params;

    const assignment = await BatchLecturer.findOne({ where: { batchId, lecturerId } });
    if (!assignment) {
      res.status(404).json({ message: 'Assignment record not found' });
      return;
    }

    await assignment.destroy();
    res.status(200).json({ message: 'Lecturer removed from batch successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLecturersByBatch = async (req: Request, res: Response) => {
  try {
    const { batchId } = req.params;
    
    // Find assignment records and include Lecturer model
    const assignments = await BatchLecturer.findAll({
      where: { batchId },
      include: [{ model: Lecturer, as: 'lecturer' }]
    });

    // Extract lecturer data
    const lecturers = assignments.map(a => (a as any).lecturer).filter(Boolean);
    res.status(200).json(lecturers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBatchesByLecturer = async (req: Request, res: Response) => {
  try {
    const { lecturerId } = req.params;

    // Find assignment records and include Batch and Course models
    const assignments = await BatchLecturer.findAll({
      where: { lecturerId },
      include: [{ 
        model: Batch, 
        as: 'batch',
        include: [{ model: Course, as: 'course' }]
      }]
    });

    // Extract batch data
    const batches = assignments.map(a => (a as any).batch).filter(Boolean);
    res.status(200).json(batches);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
