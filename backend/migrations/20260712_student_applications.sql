-- Run once against the existing event1 database. This migration is additive and does not drop data.
ALTER TABLE students DROP INDEX email;
ALTER TABLE students
  ADD COLUMN application_number VARCHAR(255) NULL UNIQUE,
  ADD COLUMN nationality VARCHAR(255) NULL,
  ADD COLUMN country_of_origin VARCHAR(255) NULL,
  ADD COLUMN course_id CHAR(36) NULL,
  ADD COLUMN batch_id CHAR(36) NULL,
  ADD COLUMN company_name VARCHAR(255) NULL,
  ADD COLUMN outside_position VARCHAR(255) NULL,
  ADD COLUMN service_number VARCHAR(255) NULL,
  ADD COLUMN epf_number VARCHAR(255) NULL,
  ADD COLUMN department VARCHAR(255) NULL,
  ADD COLUMN slpa_position VARCHAR(255) NULL;
CREATE INDEX students_identity_application ON students (nic, passport, course_id, batch_id, application_status);
CREATE TABLE IF NOT EXISTS slpa_employees (
  id CHAR(36) PRIMARY KEY, service_number VARCHAR(255) NOT NULL UNIQUE, epf_number VARCHAR(255) NOT NULL UNIQUE,
  nic VARCHAR(255) NOT NULL UNIQUE, full_name VARCHAR(255) NOT NULL, first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL, department VARCHAR(255) NOT NULL, position VARCHAR(255) NOT NULL,
  dob DATE NOT NULL, gender ENUM('Male','Female','Other') NOT NULL, email VARCHAR(255), phone VARCHAR(255),
  active BOOLEAN NOT NULL DEFAULT TRUE, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL
);
