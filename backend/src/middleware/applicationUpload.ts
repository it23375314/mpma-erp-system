import multer from 'multer';

const allowed = new Set(['application/pdf', 'image/jpeg', 'image/png']);
export const applicationUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => allowed.has(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Only PDF, JPG, JPEG and PNG documents are allowed.')),
}).array('documents', 10);
