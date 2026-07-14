import { sequelize } from '../config/db';
import { Course } from '../models/Course';
import { Batch } from '../models/Batch';
import { Lecturer } from '../models/Lecturer';
import { BatchLecturer } from '../models/BatchLecturer';
import { setupAssociations } from '../models/associations';

const syncDatabase = async () => {
  try {
    // Setup model relationships
    setupAssociations();

    // Authenticate database connection
    await sequelize.authenticate();
    console.log('Database connected.');

    // Synchronize models
    console.log('Syncing Course, Batch, Lecturer, and BatchLecturer models...');
    await Course.sync({ alter: true });
    await Batch.sync({ alter: true });
    await Lecturer.sync({ alter: true });
    await BatchLecturer.sync({ alter: true });

    console.log('Database synchronization completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error synchronizing database:', error);
    process.exit(1);
  }
};

syncDatabase();
