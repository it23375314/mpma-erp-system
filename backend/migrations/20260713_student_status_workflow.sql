-- Keep the live students.status enum aligned with the application workflow.
-- This is additive and preserves all existing status values and rows.
ALTER TABLE students
  MODIFY COLUMN status ENUM(
    'Pending',
    'Applied',
    'Qualified',
    'Enrolled',
    'Registered',
    'Graduated',
    'Dropout'
  ) NOT NULL DEFAULT 'Pending';
