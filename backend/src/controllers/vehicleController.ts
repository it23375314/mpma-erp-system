import { Request, Response } from 'express';
import { Vehicle } from '../models/Vehicle';

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.status(200).json(vehicles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id as string);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    
    await vehicle.destroy();
    res.status(200).json({ message: 'Vehicle removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id as string);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    await vehicle.update(req.body);
    res.status(200).json(vehicle);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
