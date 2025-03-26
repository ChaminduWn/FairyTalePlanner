import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  postAdvertisment, 
  getAdvertisments, 
  getAdvertismentById,
  updateAdvertismentStatus,
  updateAdvertisment,
  deleteAdvertisment
} from '../controllers/advertismentController.js';

const router = express.Router();

// Configure multer for file uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Routes
router.route('/')
  .post(upload.single('image'), postAdvertisment)
  .get(getAdvertisments);

router.route('/:id')
  .get(getAdvertismentById)
  .put(upload.single('image'), updateAdvertisment)
  .delete(deleteAdvertisment);

router.route('/:id/status')
  .patch(updateAdvertismentStatus);

router.route('/:id/approve').patch((req, res) => {
  req.body.status = "Approved";
  return updateAdvertismentStatus(req, res);
});

router.route('/:id/reject').patch((req, res) => {
  req.body.status = "Rejected";
  return updateAdvertismentStatus(req, res);
});

// Protected routes with middleware
// router.use(protect);
// router.route('/:id').put(updateAdvertisment).delete(deleteAdvertisment);
// router.use(adminOnly);
// For admin-only routes

export default router;