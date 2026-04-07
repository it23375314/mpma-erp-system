import { Request, Response } from 'express';
import Maintenance from '../models/Maintenance';
import { Classroom } from '../models/Classroom';
import { Vehicle } from '../models/Vehicle';
import { Op } from 'sequelize';

// @desc    Get all maintenances
// @route   GET /api/maintenances
// @access  Public
export const getMaintenances = async (req: Request, res: Response) => {
  try {
    const { facilityType, date } = req.query;
    
    const whereClause: any = {};
    if (facilityType) {
      whereClause.facilityType = facilityType;
    }
    
    // Optional date filter: find maintenances that overlap with specific date
    if (date) {
      whereClause.dateFrom = { [Op.lte]: date };
      whereClause.dateTo = { [Op.gte]: date };
    }

    const maintenances = await Maintenance.findAll({
      where: whereClause,
      include: [
        { model: Classroom, as: 'classroom' },
        { model: Vehicle, as: 'vehicle' }
      ],
      order: [['dateFrom', 'DESC']],
    });
    res.json(maintenances);
  } catch (error) {
    console.error('Error fetching maintenances:', error);
    res.status(500).json({ message: 'Server error fetching maintenances' });
  }
};

// @desc    Get conflicting maintenances for a specific facility
// @route   POST /api/maintenances/check-conflict
// @access  Public
export const checkMaintenanceConflict = async (req: Request, res: Response) => {
  try {
    const { facilityType, facilityId, dateFrom, dateTo, timeFrom, timeTo } = req.body;

    const whereClause: any = {
      // Check if it's for this specific facility, OR it's a general facility maintenance
      [Op.or]: [
        { facilityType: 'General' },
        { 
          facilityType, 
          // If a specific ID is provided, check for that ID or null (meaning all of that type)
          ...(facilityId ? { 
            [Op.or]: [{ facilityId }, { facilityId: null }] 
          } : {})
        }
      ],
      // Overlapping date math: startA <= endB AND endA >= startB
      dateFrom: { [Op.lte]: dateTo },
      dateTo: { [Op.gte]: dateFrom },
    };

    // If dates are exactly the same, also check time overlap
    // Note: this is a simplification. A more robust check might need raw SQL for exact timestamp overlaps
    // But for daily bookings, this date-level overlap is usually sufficient.

    const conflicts = await Maintenance.findAll({ 
      where: whereClause,
      include: [
        { model: Classroom, as: 'classroom' },
        { model: Vehicle, as: 'vehicle' }
      ]
    });
    res.json({
      hasConflict: conflicts.length > 0,
      conflicts
    });
  } catch (error) {
    console.error('Error checking maintenance conflicts:', error);
    res.status(500).json({ message: 'Server error checking conflicts' });
  }
};

// @desc    Create a new maintenance record
// @route   POST /api/maintenances
// @access  Admin
export const createMaintenance = async (req: Request, res: Response) => {
  try {
    const { title, description, facilityType, facilityId, dateFrom, dateTo, timeFrom, timeTo } = req.body;

    const maintenance = await Maintenance.create({
      title,
      description,
      facilityType,
      facilityId: facilityId || null,
      dateFrom,
      dateTo,
      timeFrom,
      timeTo,
    });

    res.status(201).json(maintenance);
  } catch (error) {
    console.error('Error creating maintenance:', error);
    res.status(500).json({ message: 'Error creating maintenance record' });
  }
};

// @desc    Delete a maintenance record
// @route   DELETE /api/maintenances/:id
// @access  Admin
export const deleteMaintenance = async (req: Request, res: Response) => {
  try {
    const maintenance = await Maintenance.findByPk(req.params.id as string);
    
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    await maintenance.destroy();
    res.json({ message: 'Maintenance removed successfully' });
  } catch (error) {
    console.error('Error deleting maintenance:', error);
    res.status(500).json({ message: 'Error deleting maintenance record' });
  }
};

// @desc    Update a maintenance record
// @route   PUT /api/maintenances/:id
// @access  Admin
export const updateMaintenance = async (req: Request, res: Response) => {
  try {
    const maintenance = await Maintenance.findByPk(req.params.id as string);

    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    const { title, description, facilityType, facilityId, dateFrom, dateTo, timeFrom, timeTo } = req.body;

    await maintenance.update({
      title,
      description,
      facilityType,
      facilityId: facilityId || null,
      dateFrom,
      dateTo,
      timeFrom,
      timeTo,
    });

    res.json(maintenance);
  } catch (error) {
    console.error('Error updating maintenance:', error);
    res.status(500).json({ message: 'Error updating maintenance record' });
  }
};
