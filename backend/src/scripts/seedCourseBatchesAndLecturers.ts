import '../config/env';
import { sequelize } from '../config/db';
import { Course } from '../models/Course';
import { Batch } from '../models/Batch';
import { Lecturer } from '../models/Lecturer';
import { BatchLecturer } from '../models/BatchLecturer';

const courseCodes = ['MAR-SEA', 'OHS', 'PORT-LOG', 'TECH', 'MGT-IS'];
const lecturerNames = [
  'Capt. Nimal Perera',
  'Dr. Anushka Fernando',
  'Mr. Dinesh Silva',
  'Ms. Kavindi Jayasinghe',
  'Eng. Ruwan Wijesekara',
];

const toDate = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const seedCourseData = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    let batchesCreated = 0;
    let lecturersCreated = 0;
    let assignmentsCreated = 0;

    for (let courseIndex = 0; courseIndex < courseCodes.length; courseIndex += 1) {
      const courseCode = courseCodes[courseIndex];
      const course = await Course.findOne({ where: { courseCode } });

      if (!course) {
        throw new Error(`Course ${courseCode} was not found. Run npm run seed:courses first.`);
      }

      const lecturers: Lecturer[] = [];

      for (let lecturerIndex = 0; lecturerIndex < 5; lecturerIndex += 1) {
        const sequence = courseIndex * 5 + lecturerIndex + 1;
        const name = lecturerNames[lecturerIndex];
        const email = `${courseCode.toLowerCase().replace(/[^a-z0-9]/g, '')}.lecturer${lecturerIndex + 1}@mpma.demo`;
        const nicPassport = `MPMA-DEMO-${String(sequence).padStart(3, '0')}`;

        const [lecturer, wasCreated] = await Lecturer.findOrCreate({
          where: { email },
          defaults: {
            fullName: `${name} (${courseCode})`,
            nicPassport,
            dateOfBirth: toDate(1975 + lecturerIndex * 3, lecturerIndex + 1, 10 + lecturerIndex),
            gender: lecturerIndex === 1 || lecturerIndex === 3 ? 'Female' : 'Male',
            mobile: `077${String(1000000 + sequence).padStart(7, '0')}`,
            email,
            address: `${20 + sequence}, Maritime Avenue, Colombo 15`,
            emergencyContact: `071${String(2000000 + sequence).padStart(7, '0')}`,
            bankName: 'Bank of Ceylon',
            branchName: 'Colombo Fort',
            accountHolderName: `${name} (${courseCode})`,
            accountNumber: `70${String(100000 + sequence).padStart(6, '0')}`,
            status: 'Active',
          },
        });

        if (wasCreated) lecturersCreated += 1;
        lecturers.push(lecturer);
      }

      for (let batchIndex = 0; batchIndex < 5; batchIndex += 1) {
        const batchNumber = batchIndex + 1;
        const startMonth = 1 + batchIndex * 2;
        const endMonth = Math.min(startMonth + 5, 12);
        const batchCode = `${courseCode}-2026-${String(batchNumber).padStart(2, '0')}`;

        const [batch, wasCreated] = await Batch.findOrCreate({
          where: { batchCode },
          defaults: {
            batchCode,
            courseId: course.id,
            startDate: toDate(2026, startMonth, 1),
            endDate: toDate(2026, endMonth, 28),
            location: `MPMA Training Room ${courseIndex + 1}`,
            maxStudents: 40,
            currentStudents: 10 + batchIndex * 3,
            status: 'Available',
          },
        });

        if (wasCreated) batchesCreated += 1;

        for (const lecturer of lecturers) {
          const [, assignmentCreated] = await BatchLecturer.findOrCreate({
            where: { batchId: batch.id, lecturerId: lecturer.id },
            defaults: { batchId: batch.id, lecturerId: lecturer.id },
          });
          if (assignmentCreated) assignmentsCreated += 1;
        }
      }
    }

    console.log(
      `Course demo data synchronized: ${batchesCreated} batches, ${lecturersCreated} lecturers, and ${assignmentsCreated} assignments created.`,
    );
  } catch (error) {
    console.error('Unable to synchronize course demo data:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

seedCourseData();
