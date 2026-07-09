import { Request, Response } from 'express';
import { Course } from '../models/Course';

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.findAll({
      order: [['courseName', 'ASC']]
    });
    res.status(200).json(courses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await Course.findByPk(req.params.id as string);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    res.status(200).json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseCode } = req.body;
    
    // Check if course code is already registered
    const existing = await Course.findOne({ where: { courseCode } });
    if (existing) {
      res.status(400).json({ message: `Course code "${courseCode}" already exists` });
      return;
    }

    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id as string);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    const { courseCode } = req.body;
    if (courseCode && courseCode !== course.courseCode) {
      const existing = await Course.findOne({ where: { courseCode } });
      if (existing) {
        res.status(400).json({ message: `Course code "${courseCode}" is already in use by another course` });
        return;
      }
    }

    await course.update(req.body);
    res.status(200).json(course);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const toggleCourseStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id as string);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    const newStatus = course.status === 'Active' ? 'Inactive' : 'Active';
    await course.update({ status: newStatus });
    res.status(200).json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
