import { Request, Response } from 'express';
import { Classroom } from '../models/Classroom';

export const getClassrooms = async (req: Request, res: Response) => {
  try {
    const classrooms = await Classroom.findAll();
    res.status(200).json(classrooms);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createClassroom = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.create(req.body);
    res.status(201).json(classroom);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteClassroom = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.findByPk(req.params.id as string);
    if (!classroom) return res.status(404).json({ message: 'Classroom not found' });

    await classroom.destroy();
    res.status(200).json({ message: 'Classroom deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClassroom = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.findByPk(req.params.id as string);
    if (!classroom) return res.status(404).json({ message: 'Classroom not found' });

    await classroom.update(req.body);
    res.status(200).json(classroom);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
